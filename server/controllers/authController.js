const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// In-memory fallback user store if MongoDB is offline
const inMemoryUsers = new Map();

const sendTokenResponse = (user, statusCode, res) => {
  const secret = process.env.JWT_SECRET || 'mailmind_fallback_jwt_secret_dev';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  const userId = user._id || user.id;

  const token = jwt.sign({ id: userId }, secret, { expiresIn });

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token,
      data: {
        _id: userId,
        name: user.name,
        email: user.email,
        gmailConnected: Boolean(user.gmailConnected),
        createdAt: user.createdAt || new Date().toISOString(),
      },
    });
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      });
    }

    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.',
        });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
      });

      return sendTokenResponse(user, 201, res);
    } else {
      // In-memory dev fallback
      const lowerEmail = email.toLowerCase();
      if (inMemoryUsers.has(lowerEmail)) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = {
        _id: `user-${Date.now()}`,
        name,
        email: lowerEmail,
        password: hashedPassword,
        gmailConnected: true, // Default to true in dev mode
        createdAt: new Date().toISOString(),
      };

      inMemoryUsers.set(lowerEmail, user);
      return sendTokenResponse(user, 201, res);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Login existing user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const lowerEmail = email.toLowerCase();

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: lowerEmail }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
      }

      return sendTokenResponse(user, 200, res);
    } else {
      // In-memory dev fallback
      let user = inMemoryUsers.get(lowerEmail);
      if (!user) {
        // Create auto demo user for testing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user = {
          _id: `user-${Date.now()}`,
          name: email.split('@')[0] || 'Demo User',
          email: lowerEmail,
          password: hashedPassword,
          gmailConnected: true,
          createdAt: new Date().toISOString(),
        };
        inMemoryUsers.set(lowerEmail, user);
      } else {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({
            success: false,
            message: 'Invalid email or password.',
          });
        }
      }

      return sendTokenResponse(user, 200, res);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully.',
    data: {},
  });
};

// @desc    Get currently logged-in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.user.id);
      return res.status(200).json({
        success: true,
        data: user,
      });
    } else {
      // In-memory fallback lookup
      for (const user of inMemoryUsers.values()) {
        if (user._id === req.user.id) {
          return res.status(200).json({
            success: true,
            data: user,
          });
        }
      }

      return res.status(200).json({
        success: true,
        data: {
          _id: req.user.id,
          name: 'Demo User',
          email: 'user@example.com',
          gmailConnected: true,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  logout,
  getMe,
};
