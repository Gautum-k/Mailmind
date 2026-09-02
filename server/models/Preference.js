const mongoose = require('mongoose');

const preferenceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    defaultTone: {
      type: String,
      enum: ['Professional', 'Friendly', 'Formal', 'Concise'],
      default: 'Professional',
    },
    theme: {
      type: String,
      enum: ['dark', 'light', 'system'],
      default: 'dark',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Preference', preferenceSchema);
