const geminiService = require('../services/geminiService');
const { getAuthenticatedClient } = require('../services/tokenService');
const gmailService = require('../services/gmailService');
const { logActivity } = require('./activityController');

// @desc    Summarize email message using Gemini AI
// @route   POST /api/ai/summarize
// @access  Private
const summarize = async (req, res, next) => {
  try {
    const { emailId, subject, bodyText } = req.body;
    let targetSubject = subject;
    let targetBody = bodyText;

    if (emailId && (!targetSubject || !targetBody)) {
      const auth = await getAuthenticatedClient(req.user.id);
      const message = await gmailService.getMessage(auth, emailId);
      targetSubject = message.subject;
      targetBody = message.bodyText || message.bodyHtml;
    }

    if (!targetBody) {
      return res.status(400).json({
        success: false,
        message: 'Email content is required for AI summarization.',
      });
    }

    const summary = await geminiService.summarizeEmail({
      subject: targetSubject,
      bodyText: targetBody,
    });

    // Log Activity safely
    await logActivity({
      userId: req.user.id,
      type: 'summarize',
      emailSubject: targetSubject || '(No Subject)',
      gmailMessageId: emailId || '',
    });

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate AI draft reply using Gemini AI
// @route   POST /api/ai/generate-reply
// @access  Private
const generateReply = async (req, res, next) => {
  try {
    const { emailId, subject, bodyText, tone = 'Professional', senderName } = req.body;
    let targetSubject = subject;
    let targetBody = bodyText;
    let targetSender = senderName;

    if (emailId && (!targetSubject || !targetBody)) {
      const auth = await getAuthenticatedClient(req.user.id);
      const message = await gmailService.getMessage(auth, emailId);
      targetSubject = message.subject;
      targetBody = message.bodyText || message.bodyHtml;
      targetSender = message.from;
    }

    if (!targetBody) {
      return res.status(400).json({
        success: false,
        message: 'Email content is required for reply generation.',
      });
    }

    const draft = await geminiService.generateReply({
      subject: targetSubject,
      bodyText: targetBody,
      tone,
      senderName: targetSender,
    });

    // Log Activity safely
    await logActivity({
      userId: req.user.id,
      type: 'reply_generated',
      emailSubject: targetSubject || '(No Subject)',
      gmailMessageId: emailId || '',
      details: `Tone: ${tone}`,
    });

    res.status(200).json({
      success: true,
      data: draft,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Classify email category & priority using Gemini AI
// @route   POST /api/ai/classify
// @access  Private
const classify = async (req, res, next) => {
  try {
    const { emailId, subject, bodyText } = req.body;
    let targetSubject = subject;
    let targetBody = bodyText;

    if (emailId && (!targetSubject || !targetBody)) {
      const auth = await getAuthenticatedClient(req.user.id);
      const message = await gmailService.getMessage(auth, emailId);
      targetSubject = message.subject;
      targetBody = message.bodyText || message.bodyHtml;
    }

    const classification = await geminiService.classifyEmail({
      subject: targetSubject,
      bodyText: targetBody,
    });

    res.status(200).json({
      success: true,
      data: classification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Extract action items from email
// @route   POST /api/ai/extract-actions
// @access  Private
const extractActions = async (req, res, next) => {
  try {
    const { emailId, subject, bodyText } = req.body;
    let targetSubject = subject;
    let targetBody = bodyText;

    if (emailId && (!targetSubject || !targetBody)) {
      const auth = await getAuthenticatedClient(req.user.id);
      const message = await gmailService.getMessage(auth, emailId);
      targetSubject = message.subject;
      targetBody = message.bodyText || message.bodyHtml;
    }

    const result = await geminiService.extractActions({
      subject: targetSubject,
      bodyText: targetBody,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Extract dates and deadlines
// @route   POST /api/ai/extract-dates
// @access  Private
const extractDates = async (req, res, next) => {
  try {
    const { emailId, subject, bodyText } = req.body;
    let targetSubject = subject;
    let targetBody = bodyText;

    if (emailId && (!targetSubject || !targetBody)) {
      const auth = await getAuthenticatedClient(req.user.id);
      const message = await gmailService.getMessage(auth, emailId);
      targetSubject = message.subject;
      targetBody = message.bodyText || message.bodyHtml;
    }

    const result = await geminiService.extractDates({
      subject: targetSubject,
      bodyText: targetBody,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Translate Natural Language into Gmail Query
// @route   POST /api/ai/smart-search
// @access  Private
const smartSearch = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: 'Search prompt is required.',
      });
    }

    const translated = await geminiService.translateSmartSearch(prompt);

    // Log Activity safely
    await logActivity({
      userId: req.user.id,
      type: 'smart_search',
      details: prompt,
    });

    res.status(200).json({
      success: true,
      data: translated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  summarize,
  generateReply,
  classify,
  extractActions,
  extractDates,
  smartSearch,
};
