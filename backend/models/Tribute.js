const mongoose = require('mongoose');

const tributeSchema = new mongoose.Schema({
  memorial: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Memorial',
    required: true
  },
  authorName: {
    type: String,
    required: true,
    maxlength: 250
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  flagged: {
    hasProfanity: { type: Boolean, default: false },
    flaggedWords: [String],
    customFlags: [String]
  },
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderatedAt: Date,
  rejectionReason: String,
  ipAddress: String,
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient querying
tributeSchema.index({ memorial: 1, status: 1 });
tributeSchema.index({ submittedAt: -1 });

module.exports = mongoose.model('Tribute', tributeSchema);