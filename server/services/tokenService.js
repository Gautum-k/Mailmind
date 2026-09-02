const GmailToken = require('../models/GmailToken');
const User = require('../models/User');
const { getOAuth2Client } = require('../config/googleClient');

/**
 * Gets an authenticated OAuth2 client for a given user.
 * Automatically refreshes access tokens using stored Google OAuth refresh tokens.
 */
const getAuthenticatedClient = async (userId) => {
  const tokenDoc = await GmailToken.findOne({ user: userId });
  if (!tokenDoc) {
    throw new Error('Gmail account not connected. Please connect your Gmail account via OAuth 2.0.');
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
      await User.findByIdAndUpdate(userId, { gmailConnected: false });
      throw new Error('Gmail authorization expired. Please reconnect your Gmail account.');
    }
  }

  return oauth2Client;
};

module.exports = {
  getAuthenticatedClient,
};
