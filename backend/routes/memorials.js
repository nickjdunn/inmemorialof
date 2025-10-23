const express = require('express');
const router = express.Router();
const Memorial = require('../models/Memorial');
const { protect } = require('../middleware/auth');

// @route   POST /api/memorials
// @desc    Create new memorial
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { fullName, birthDate, deathDate, biography, profilePhoto, showDates, status } = req.body;

    // Check if user has available slots
    const userMemorialCount = await Memorial.countDocuments({ 
      owner: req.user._id,
      inTrash: false 
    });

    if (userMemorialCount >= req.user.memorialSlots) {
      return res.status(400).json({ error: 'No available memorial slots' });
    }

    // Generate unique URL
    const url = await Memorial.generateUniqueUrl();

    const memorial = await Memorial.create({
      owner: req.user._id,
      url,
      fullName,
      birthDate,
      deathDate,
      biography: { content: biography, showBiography: true },
      profilePhoto: profilePhoto || {},
      showDates: showDates !== false,
      status: status || 'unpublished'
    });

    res.status(201).json({ memorial });
  } catch (error) {
    console.error('Create memorial error:', error);
    res.status(500).json({ error: 'Failed to create memorial' });
  }
});

// @route   GET /api/memorials/my-memorials
// @desc    Get user's memorials
// @access  Private
router.get('/my-memorials', protect, async (req, res) => {
  try {
    const memorials = await Memorial.find({ 
      owner: req.user._id,
      inTrash: false 
    }).sort({ createdAt: -1 });

    res.json({ memorials });
  } catch (error) {
    console.error('Get memorials error:', error);
    res.status(500).json({ error: 'Failed to fetch memorials' });
  }
});

// @route   GET /api/memorials/edit/:id
// @desc    Get memorial for editing (includes all data)
// @access  Private
router.get('/edit/:id', protect, async (req, res) => {
  try {
    const memorial = await Memorial.findById(req.params.id);

    if (!memorial) {
      return res.status(404).json({ error: 'Memorial not found' });
    }

    // Check if user can edit
    if (!memorial.canEdit(req.user._id)) {
      return res.status(403).json({ error: 'Not authorized to edit this memorial' });
    }

    res.json({ memorial });
  } catch (error) {
    console.error('Get memorial for edit error:', error);
    res.status(500).json({ error: 'Failed to fetch memorial' });
  }
});

// @route   GET /api/memorials/:url
// @desc    Get memorial by URL
// @access  Public
router.get('/:url', async (req, res) => {
  try {
    const memorial = await Memorial.findOne({ url: req.params.url })
      .populate('owner', 'name email');

    if (!memorial) {
      return res.status(404).json({ error: 'Memorial not found' });
    }

    // Check if memorial is published or if requester is owner
    if (memorial.status === 'unpublished' && 
        (!req.user || memorial.owner._id.toString() !== req.user._id.toString())) {
      return res.status(404).json({ error: 'Memorial not found' });
    }

    // Increment view count
    memorial.viewCount += 1;
    await memorial.save();

    res.json({ memorial });
  } catch (error) {
    console.error('Get memorial error:', error);
    res.status(500).json({ error: 'Failed to fetch memorial' });
  }
});

// @route   PUT /api/memorials/:id
// @desc    Update memorial
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const memorial = await Memorial.findById(req.params.id);

    if (!memorial) {
      return res.status(404).json({ error: 'Memorial not found' });
    }

    // Check if user owns memorial or can edit
    if (!memorial.canEdit(req.user._id)) {
      return res.status(403).json({ error: 'Not authorized to edit this memorial' });
    }

    // Update fields - UPDATED TO INCLUDE ALL NEW FIELDS
    const allowedUpdates = [
      'fullName', 
      'birthDate', 
      'deathDate', 
      'biography', 
      'profilePhoto', 
      'coverPhoto',        // ADDED FOR COVER PHOTO FEATURE
      'showDates', 
      'status', 
      'gallery', 
      'timeline',
      'familyMembers',
      'showFamily',
      'favorites',
      'showFavorites'
    ];
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'biography') {
          memorial.biography.content = req.body[field];
        } else {
          memorial[field] = req.body[field];
        }
      }
    });

    await memorial.save();

    res.json({ memorial });
  } catch (error) {
    console.error('Update memorial error:', error);
    res.status(500).json({ error: 'Failed to update memorial' });
  }
});

// @route   DELETE /api/memorials/:id
// @desc    Move memorial to trash
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const memorial = await Memorial.findById(req.params.id);

    if (!memorial) {
      return res.status(404).json({ error: 'Memorial not found' });
    }

    // Only owner can delete
    if (memorial.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this memorial' });
    }

    memorial.inTrash = true;
    memorial.trashedAt = new Date();
    await memorial.save();

    res.json({ message: 'Memorial moved to trash' });
  } catch (error) {
    console.error('Delete memorial error:', error);
    res.status(500).json({ error: 'Failed to delete memorial' });
  }
});

module.exports = router;