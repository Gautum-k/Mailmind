const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // 1. Check HTTP-only cookie first
  if (req.cookies && req.cookies.token && req.cookies.token !== 'none') {
    token = req.cookies.token;
  }
  // 2. Fallback to Authorization Bearer header
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token missing. Please log in.',
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'mailmind_fallback_jwt_secret_dev';
    const decoded = jwt.verify(token, secret);

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
        return next();
      }
    }

    // Fallback for dev mode / in-memory sessions
    req.user = {
      id: decoded.id,
      _id: decoded.id,
      name: 'Demo User',
      email: 'tester@mailmind.dev',
      gmailConnected: false,
    };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token invalid or expired.',
    });
  }
};

module.exports = { protect };
