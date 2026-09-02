const express = require('express');
const router = express.Router();
const {
  getEmails,
  getEmail,
  getThread,
  toggleReadStatus,
  toggleStarStatus,
  archiveEmail,
  deleteEmail,
  sendEmail,
  replyEmail,
} = require('../controllers/emailController');
const { protect } = require('../middleware/authMiddleware');
const { apiLimiter } = require('../middleware/rateLimiter');

router.use(protect);

router.get('/', getEmails);
router.get('/thread/:threadId', getThread);
router.get('/:id', getEmail);
router.patch('/:id/read', toggleReadStatus);
router.patch('/:id/star', toggleStarStatus);
router.patch('/:id/archive', archiveEmail);
router.delete('/:id', deleteEmail);
router.post('/send', apiLimiter, sendEmail);
router.post('/:id/reply', apiLimiter, replyEmail);

module.exports = router;
