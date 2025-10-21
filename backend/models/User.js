const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    select: false
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator', 'support'],
    default: 'user'
  },
  customPermissions: {
    type: [String],
    default: []
  },
  memorialSlots: {
    type: Number,
    default: 0
  },
  maxMemorials: {
    type: Number,
    default: null
  },
  maxPhotosPerMemorial: {
    type: Number,
    default: 20
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  magicLinkToken: String,
  magicLinkExpires: Date,
  magicLinkUses: {
    type: Number,
    default: 0
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  twoFactorSecret: String,
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  notificationPreferences: {
    tributePending: { type: Boolean, default: true },
    memorialExpiring: { type: Boolean, default: true },
    statusChanges: { type: Boolean, default: true },
    systemAnnouncements: { type: Boolean, default: true }
  },
  accountStatus: {
    type: String,
    enum: ['active', 'suspended', 'deleted'],
    default: 'active'
  },
  deletedAt: Date,
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if user has permission
userSchema.methods.hasPermission = function(permission) {
  if (this.role === 'admin') return true;
  return this.customPermissions.includes(permission);
};

// Soft delete user
userSchema.methods.softDelete = function() {
  this.accountStatus = 'deleted';
  this.deletedAt = new Date();
  return this.save();
};

// Restore deleted user
userSchema.methods.restore = function() {
  this.accountStatus = 'active';
  this.deletedAt = null;
  return this.save();
};

module.exports = mongoose.model('User', userSchema);