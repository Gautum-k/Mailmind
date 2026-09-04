const { getOAuth2Client, GMAIL_SCOPES } = require('../config/googleClient');
const GmailToken = require('../models/GmailToken');
const User = require('../models/User');
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');

// @desc    Initiate Gmail OAuth 2.0 flow -> Redirect to Google Consent Screen
// @route   GET /api/gmail/connect
// @access  Private (or Public with state token)
const connectGmail = async (req, res, next) => {
  try {
    let userId = req.user ? req.user.id : null;

    if (!userId && req.query.token) {
      try {
        const secret = process.env.JWT_SECRET || 'mailmind_fallback_jwt_secret_dev';
        const decoded = jwt.verify(req.query.token, secret);
        userId = decoded.id;
      } catch (err) {
        // Token decode error
      }
    }

    if (!userId && req.cookies && req.cookies.token) {
      try {
        const secret = process.env.JWT_SECRET || 'mailmind_fallback_jwt_secret_dev';
        const decoded = jwt.verify(req.cookies.token, secret);
        userId = decoded.id;
      } catch (err) {
        // Cookie decode error
      }
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required before connecting Gmail.',
      });
    }

    const oauth2Client = getOAuth2Client();

    const stateToken = jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'mailmind_fallback_jwt_secret_dev',
      { expiresIn: '15m' }
    );

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: GMAIL_SCOPES,
      state: stateToken,
    });

    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.status(200).json({ success: true, url });
    }

    res.redirect(url);
  } catch (error) {
    next(error);
  }
};

// @desc    Handle Google OAuth 2.0 redirect callback
// @route   GET /api/gmail/callback
// @access  Public
const gmailCallback = async (req, res, next) => {
  try {
    const { code, state, error: googleError } = req.query;
    const clientUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173';

    if (googleError) {
      console.error('[Google OAuth Error Callback]', googleError);
      return res.redirect(`${clientUrl}/connect-gmail?error=${encodeURIComponent(googleError)}`);
    }

    if (!code || !state) {
      return res.redirect(`${clientUrl}/connect-gmail?error=Missing+authorization+code+or+state`);
    }

    // Verify state token to get user ID
    let userId;
    try {
      const secret = process.env.JWT_SECRET || 'mailmind_fallback_jwt_secret_dev';
      const decoded = jwt.verify(state, secret);
      userId = decoded.userId;
    } catch (err) {
      return res.redirect(`${clientUrl}/connect-gmail?error=Invalid+or+expired+OAuth+session`);
    }

    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get primary email address from userinfo API
    let userEmail = '';
    try {
      const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
      const userInfo = await oauth2.userinfo.get();
      userEmail = userInfo.data.email || '';
    } catch (infoErr) {
      console.warn('[UserInfo Fetch Warning]', infoErr.message);
    }

    // Construct token update object cleanly preserving existing refreshToken if omitted by Google
    const tokenUpdate = {
      user: userId,
      accessToken: tokens.access_token,
      expiryDate: tokens.expiry_date,
      scope: tokens.scope,
    };
    if (userEmail) tokenUpdate.email = userEmail;
    if (tokens.refresh_token) tokenUpdate.refreshToken = tokens.refresh_token;

    await GmailToken.findOneAndUpdate(
      { user: userId },
      tokenUpdate,
      { upsert: true, new: true, runValidators: true }
    );

    // Update User record
    await User.findByIdAndUpdate(userId, { gmailConnected: true });

    res.redirect(`${clientUrl}/connect-gmail?connected=true`);
  } catch (error) {
    console.error('[OAuth Callback Exception]', error);
    const clientUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${clientUrl}/connect-gmail?error=${encodeURIComponent(error.message)}`);
  }
};

// @desc    Get Gmail connection status
// @route   GET /api/gmail/status
// @access  Private
const getGmailStatus = async (req, res, next) => {
  try {
    const tokenDoc = await GmailToken.findOne({ user: req.user.id });

    if (!tokenDoc) {
      return res.status(200).json({
        success: true,
        connected: false,
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      connected: true,
      data: {
        email: tokenDoc.email,
        expiryDate: tokenDoc.expiryDate,
        updatedAt: tokenDoc.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Disconnect Gmail account & revoke tokens
// @route   POST /api/gmail/disconnect
// @access  Private
const disconnectGmail = async (req, res, next) => {
  try {
    const tokenDoc = await GmailToken.findOne({ user: req.user.id });

    if (tokenDoc) {
      try {
        const oauth2Client = getOAuth2Client();
        oauth2Client.setCredentials({ access_token: tokenDoc.accessToken });
        await oauth2Client.revokeToken(tokenDoc.accessToken);
      } catch (revokeErr) {
        console.warn('[Token Revoke Warning]', revokeErr.message);
      }

      await GmailToken.deleteOne({ user: req.user.id });
    }

    await User.findByIdAndUpdate(req.user.id, { gmailConnected: false });

    res.status(200).json({
      success: true,
      message: 'Gmail account disconnected successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  connectGmail,
  gmailCallback,
  getGmailStatus,
  disconnectGmail,
};
