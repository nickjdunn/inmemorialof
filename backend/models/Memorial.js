const mongoose = require('mongoose');

const memorialSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  managers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    permissions: {
      canEdit: { type: Boolean, default: true },
      canModerate: { type: Boolean, default: true },
      canManageGallery: { type: Boolean, default: true }
    },
    invitedAt: Date,
    acceptedAt: Date
  }],
  url: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['public', 'private', 'unpublished'],
    default: 'unpublished'
  },
  password: String,
  expirationDate: Date,
  isExpired: {
    type: Boolean,
    default: false
  },
  fullName: {
    type: String,
    required: true
  },
  birthDate: Date,
  deathDate: Date,
  showDates: {
    type: Boolean,
    default: true
  },
  profilePhoto: {
    url: String,
    shape: {
      type: String,
      enum: ['circle', 'square', 'rounded-square', 'heart', 'oval'],
      default: 'circle'
    },
    croppedData: mongoose.Schema.Types.Mixed
  },
  coverPhoto: {
    url: String,
    size: {
      type: String,
      enum: ['tall', 'medium', 'short'],
      default: 'medium'
    },
    position: {
      type: String,
      enum: ['top', 'center', 'bottom'],
      default: 'center'
    },
    showGradient: {
      type: Boolean,
      default: true
    }
  },
  biography: {
    content: String,
    showBiography: { type: Boolean, default: true }
  },
  gallery: {
    photos: [{
      url: String,
      thumbnail: String,
      caption: String,
      order: Number,
      uploadedAt: { type: Date, default: Date.now }
    }],
    videos: [{
      url: String,
      platform: String,
      thumbnail: String,
      caption: String,
      autoplay: { type: Boolean, default: false },
      order: Number,
      addedAt: { type: Date, default: Date.now }
    }],
    displayStyle: {
      type: String,
      enum: ['grid', 'carousel'],
      default: 'grid'
    },
    showGallery: { type: Boolean, default: true }
  },
  timeline: {
    events: [{
      date: Date,
      yearOnly: Boolean,
      title: String,
      description: String,
      photoRef: String,
      order: Number
    }],
    showTimeline: { type: Boolean, default: true }
  },
  familyMembers: [{
    name: String,
    relationship: String,
    description: String,
    order: Number
  }],
  showFamily: {
    type: Boolean,
    default: true
  },
  favorites: [{
    category: String,
    icon: String,
    content: String,
    order: Number
  }],
  showFavorites: {
    type: Boolean,
    default: true
  },
  theme: {
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Template'
    },
    accentColor: String,
    headingFont: String,
    bodyFont: String,
    headerLayout: {
      type: String,
      default: 'default'
    }
  },
  guestbook: {
    enabled: { type: Boolean, default: true },
    sortOrder: {
      type: String,
      enum: ['newest', 'oldest'],
      default: 'newest'
    }
  },
  privateNotes: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    createdAt: { type: Date, default: Date.now }
  }],
  viewCount: {
    type: Number,
    default: 0
  },
  uniqueViews: {
    type: Number,
    default: 0
  },
  shareCount: {
    social: { type: Number, default: 0 },
    qr: { type: Number, default: 0 },
    link: { type: Number, default: 0 }
  },
  socialPreview: {
    title: String,
    description: String,
    image: String
  },
  qrCode: String,
  inTrash: {
    type: Boolean,
    default: false
  },
  trashedAt: Date,
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

// Generate unique URL
memorialSchema.statics.generateUniqueUrl = async function(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let url;
  let exists = true;
  
  while (exists) {
    url = '';
    for (let i = 0; i < length; i++) {
      url += chars[Math.floor(Math.random() * chars.length)];
    }
    exists = await this.findOne({ url });
  }
  
  return url;
};

// Check if user can edit memorial
memorialSchema.methods.canEdit = function(userId) {
  if (this.owner.toString() === userId.toString()) return true;
  
  const manager = this.managers.find(m => 
    m.user.toString() === userId.toString() && m.acceptedAt
  );
  
  return manager && manager.permissions.canEdit;
};

// Check if user can moderate tributes
memorialSchema.methods.canModerate = function(userId) {
  if (this.owner.toString() === userId.toString()) return true;
  
  const manager = this.managers.find(m => 
    m.user.toString() === userId.toString() && m.acceptedAt
  );
  
  return manager && manager.permissions.canModerate;
};

module.exports = mongoose.model('Memorial', memorialSchema);