const { getAuthenticatedClient } = require('../services/tokenService');
const gmailService = require('../services/gmailService');
const { buildMimeMessage, buildReplyMimeMessage } = require('../utils/mimeBuilder');
const { logActivity } = require('./activityController');

// Helper to handle authentication & token errors with clean 401 responses
const handleControllerError = (error, res, next) => {
  if (
    error.statusCode === 401 ||
    (error.message &&
      (error.message.includes('not connected') ||
        error.message.includes('expired') ||
        error.message.includes('authorization') ||
        error.message.includes('invalid_grant')))
  ) {
    return res.status(401).json({
      success: false,
      connected: false,
      message: error.message || 'Gmail connection or authorization required.',
    });
  }
  next(error);
};

// @desc    Get list of emails from Gmail API
// @route   GET /api/emails
// @access  Private
const getEmails = async (req, res, next) => {
  try {
    const auth = await getAuthenticatedClient(req.user.id);
    const { q, pageToken, label = 'INBOX', maxResults = 20 } = req.query;

    const labelUpper = label ? label.toUpperCase() : 'INBOX';
    let labelIds = [labelUpper];
    let searchQuery = q ? q.trim() : '';

    if (labelUpper === 'ALL') {
      labelIds = [];
    } else if (labelUpper === 'ARCHIVE') {
      // Archive in Gmail API is queried by excluding INBOX
      labelIds = [];
      searchQuery = searchQuery ? `${searchQuery} -inbox` : '-inbox';
    }

    const data = await gmailService.listMessages(auth, {
      q: searchQuery,
      pageToken,
      maxResults,
      labelIds,
    });

    res.status(200).json({
      success: true,
      data: data.messages,
      nextPageToken: data.nextPageToken,
      resultSizeEstimate: data.resultSizeEstimate,
    });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// @desc    Get single email details
// @route   GET /api/emails/:id
// @access  Private
const getEmail = async (req, res, next) => {
  try {
    const auth = await getAuthenticatedClient(req.user.id);
    const email = await gmailService.getMessage(auth, req.params.id);

    res.status(200).json({
      success: true,
      data: email,
    });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// @desc    Get full email thread
// @route   GET /api/emails/thread/:threadId
// @access  Private
const getThread = async (req, res, next) => {
  try {
    const auth = await getAuthenticatedClient(req.user.id);
    const thread = await gmailService.getThread(auth, req.params.threadId);

    res.status(200).json({
      success: true,
      data: thread,
    });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// @desc    Mark email as read / unread
// @route   PATCH /api/emails/:id/read
// @access  Private
const toggleReadStatus = async (req, res, next) => {
  try {
    const auth = await getAuthenticatedClient(req.user.id);
    const { read = true } = req.body;

    const modified = await gmailService.modifyLabels(auth, req.params.id, {
      addLabelIds: read ? [] : ['UNREAD'],
      removeLabelIds: read ? ['UNREAD'] : [],
    });

    res.status(200).json({
      success: true,
      data: modified,
    });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// @desc    Star / unstar email
// @route   PATCH /api/emails/:id/star
// @access  Private
const toggleStarStatus = async (req, res, next) => {
  try {
    const auth = await getAuthenticatedClient(req.user.id);
    const { star = true } = req.body;

    const modified = await gmailService.modifyLabels(auth, req.params.id, {
      addLabelIds: star ? ['STARRED'] : [],
      removeLabelIds: star ? [] : ['STARRED'],
    });

    // Log Activity
    await logActivity({
      userId: req.user.id,
      type: star ? 'starred' : 'unstarred',
      emailSubject: modified.subject,
      gmailMessageId: modified.id,
    });

    res.status(200).json({
      success: true,
      data: modified,
    });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// @desc    Archive email
// @route   PATCH /api/emails/:id/archive
// @access  Private
const archiveEmail = async (req, res, next) => {
  try {
    const auth = await getAuthenticatedClient(req.user.id);

    const modified = await gmailService.modifyLabels(auth, req.params.id, {
      addLabelIds: [],
      removeLabelIds: ['INBOX'],
    });

    // Log Activity
    await logActivity({
      userId: req.user.id,
      type: 'archived',
      emailSubject: modified.subject,
      gmailMessageId: modified.id,
    });

    res.status(200).json({
      success: true,
      data: modified,
    });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// @desc    Trash email
// @route   DELETE /api/emails/:id
// @access  Private
const deleteEmail = async (req, res, next) => {
  try {
    const auth = await getAuthenticatedClient(req.user.id);
    const trashed = await gmailService.trashMessage(auth, req.params.id);

    // Log Activity
    await logActivity({
      userId: req.user.id,
      type: 'deleted',
      emailSubject: trashed.subject,
      gmailMessageId: trashed.id,
    });

    res.status(200).json({
      success: true,
      message: 'Email moved to trash',
      data: trashed,
    });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// @desc    Send new email
// @route   POST /api/emails/send
// @access  Private
const sendEmail = async (req, res, next) => {
  try {
    const auth = await getAuthenticatedClient(req.user.id);
    const { to, cc, bcc, subject, body } = req.body;

    if (!to || !subject || !body) {
      return res.status(400).json({
        success: false,
        message: 'Recipient (to), subject, and body are required.',
      });
    }

    const raw = buildMimeMessage({ to, cc, bcc, subject, body });
    const sent = await gmailService.sendMessage(auth, { raw });

    // Log Activity
    await logActivity({
      userId: req.user.id,
      type: 'sent',
      emailSubject: subject,
      gmailMessageId: sent.id,
      details: `Sent to ${to}`,
    });

    res.status(201).json({
      success: true,
      message: 'Email sent successfully',
      data: sent,
    });
  } catch (error) {
    handleControllerError(error, res, next);
  }
};

// @desc    Send reply to email thread
// @route   POST /api/emails/:id/reply
// @access  Private
const replyEmail = async (req, res, next) => {
  try {
    const auth = await getAuthenticatedClient(req.user.id);
    const { body } = req.body;

    if (!body) {
      return res.status(400).json({
        success: false,
        message: 'Reply body content is required.',
      });
    }

    // Fetch original message details for thread headers
    const original = await gmailService.getMessage(auth, req.params.id);

    const raw = buildReplyMimeMessage({
      to: original.from,
      subject: original.subject,
      body,
      messageId: original.messageIdHeader,
      references: original.referencesHeader,
    });

    const sent = await gmailService.sendMessage(auth, {
      raw,
      threadId: original.threadId,
    });

    // Log Activity
    await logActivity({
      userId: req.user.id,
      type: 'sent',
      emailSubject: `Re: ${original.subject}`,
      gmailMessageId: sent.id,
      details: `Replied in thread ${original.threadId}`,
    });

    res.status(201).json({
      success: true,
      message: 'Reply sent successfully',
      data: sent,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmails,
  getEmail,
  getThread,
  toggleReadStatus,
  toggleStarStatus,
  archiveEmail,
  deleteEmail,
  sendEmail,
  replyEmail,
};
