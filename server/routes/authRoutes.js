const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  logout,
  getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateSignup, validateLogin } = require('../utils/validators');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/signup', authLimiter, validateSignup, signup);
router.post('/login', authLimiter, validateLogin, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
