const GmailToken = require('../models/GmailToken');
const User = require('../models/User');
const { getOAuth2Client } = require('../config/googleClient');

const mongoose = require('mongoose');

/**
 * Gets an authenticated OAuth2 client for a given user.
 * Automatically refreshes access tokens using stored Google OAuth refresh tokens.
 */
const getAuthenticatedClient = async (userId) => {
  if (!userId || (mongoose.connection.readyState === 1 && !mongoose.Types.ObjectId.isValid(userId))) {
    const authErr = new Error('Gmail account not connected. Please connect your Gmail account via OAuth 2.0.');
    authErr.statusCode = 401;
    throw authErr;
  }

  const tokenDoc = await GmailToken.findOne({ user: userId });
  if (!tokenDoc) {
    const authErr = new Error('Gmail account not connected. Please connect your Gmail account via OAuth 2.0.');
    authErr.statusCode = 401;
    throw authErr;
  }

  const oauth2Client = getOAuth2Client();

  oauth2Client.setCredentials({
    access_token: tokenDoc.accessToken,
    refresh_token: tokenDoc.refreshToken,
    expiry_date: tokenDoc.expiryDate,
  });

  // Listen for automatic token refresh events emitted by google-auth-library
  oauth2Client.on('tokens', async (tokens) => {
    if (tokens.access_token) {
      tokenDoc.accessToken = tokens.access_token;
    }
    if (tokens.expiry_date) {
      tokenDoc.expiryDate = tokens.expiry_date;
    }
    if (tokens.refresh_token) {
      tokenDoc.refreshToken = tokens.refresh_token;
    }
    await tokenDoc.save();
  });

  // Proactively refresh access token if within 5 minutes of expiration
  const now = Date.now();
  if (tokenDoc.expiryDate && tokenDoc.expiryDate - now < 5 * 60 * 1000) {
    try {
      const newTokens = await oauth2Client.refreshAccessToken();
      const credentials = newTokens.credentials;

      tokenDoc.accessToken = credentials.access_token;
      tokenDoc.expiryDate = credentials.expiry_date;
      if (credentials.refresh_token) {
        tokenDoc.refreshToken = credentials.refresh_token;
      }
      await tokenDoc.save();

      oauth2Client.setCredentials(credentials);
    } catch (refreshErr) {
      console.error('[OAuth Refresh Error]', refreshErr.message);
      if (mongoose.Types.ObjectId.isValid(userId)) {
        await User.findByIdAndUpdate(userId, { gmailConnected: false });
      }
      const expiredErr = new Error('Gmail authorization expired. Please reconnect your Gmail account.');
      expiredErr.statusCode = 401;
      throw expiredErr;
    }
  }

  return oauth2Client;
};

module.exports = {
  getAuthenticatedClient,
};
