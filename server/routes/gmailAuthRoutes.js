const express = require('express');
const router = express.Router();
const {
  connectGmail,
  gmailCallback,
  getGmailStatus,
  disconnectGmail,
} = require('../controllers/gmailAuthController');
const { protect } = require('../middleware/authMiddleware');

router.get('/connect', connectGmail);
router.get('/callback', gmailCallback);
router.get('/status', protect, getGmailStatus);
router.post('/disconnect', protect, disconnectGmail);

module.exports = router;
