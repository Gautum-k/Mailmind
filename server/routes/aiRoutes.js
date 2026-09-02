const express = require('express');
const router = express.Router();
const {
  summarize,
  generateReply,
  classify,
  extractActions,
  extractDates,
  smartSearch,
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const { apiLimiter } = require('../middleware/rateLimiter');

router.use(protect);
router.use(apiLimiter);

router.post('/summarize', summarize);
router.post('/generate-reply', generateReply);
router.post('/classify', classify);
router.post('/extract-actions', extractActions);
router.post('/extract-dates', extractDates);
router.post('/smart-search', smartSearch);

module.exports = router;
