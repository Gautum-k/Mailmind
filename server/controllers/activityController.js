const mongoose = require('mongoose');
const Activity = require('../models/Activity');

// In-memory dev activity log
const devActivities = [];

// Helper function to record activity safely in any environment
const logActivity = async ({ userId, type, emailSubject, gmailMessageId, details }) => {
  const item = {
    _id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    user: userId,
    type,
    emailSubject: emailSubject || 'No Subject',
    gmailMessageId: gmailMessageId || '',
    details: details || '',
    createdAt: new Date().toISOString(),
  };

  devActivities.unshift(item);

  if (mongoose.connection.readyState === 1) {
    try {
      await Activity.create({
        user: userId,
        type,
        emailSubject,
        gmailMessageId,
        details,
      });
    } catch (err) {
      console.warn('[Activity Logging Warning]', err.message);
    }
  }

  return item;
};

// @desc    Get user activity log
// @route   GET /api/activity
// @access  Private
const getActivity = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const activities = await Activity.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .limit(50);

      return res.status(200).json({
        success: true,
        count: activities.length,
        data: activities,
      });
    }

    // Dev fallback mock activities if DB offline
    if (devActivities.length === 0) {
      devActivities.push(
        {
          _id: 'act-1',
          user: req.user.id,
          type: 'summarized',
          emailSubject: 'Q3 Project Roadmap & Deliverables Review',
          gmailMessageId: 'msg-001',
          details: 'Generated AI bullet point summary',
          createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        },
        {
          _id: 'act-2',
          user: req.user.id,
          type: 'starred',
          emailSubject: 'Invoice #INV-2026-8892 Ready for Payment',
          gmailMessageId: 'msg-002',
          details: 'Starred invoice message',
          createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        }
      );
    }

    res.status(200).json({
      success: true,
      count: devActivities.length,
      data: devActivities,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getActivity, logActivity };
