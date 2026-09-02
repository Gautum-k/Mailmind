const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        'summarize',
        'reply_generated',
        'sent',
        'archived',
        'deleted',
        'starred',
        'unstarred',
        'read',
        'unread',
        'smart_search',
        'classified',
      ],
      required: true,
    },
    emailSubject: {
      type: String,
      default: '',
    },
    gmailMessageId: {
      type: String,
      default: '',
    },
    details: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Activity', activitySchema);
