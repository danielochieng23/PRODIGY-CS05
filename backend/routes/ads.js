const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const Ad = require('../models/Ad');
const User = require('../models/User');
const Category = require('../models/Category');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/ads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// @desc    Get all ads with filtering and pagination
// @route   GET /api/ads
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build query
    let query = { status: 'active', expiresAt: { $gt: new Date() } };

    // Filters
    if (req.query.category) {
      query.category = req.query.category;
    }
    if (req.query.subcategory) {
      query.subcategory = req.query.subcategory;
    }
    if (req.query.city) {
      query['location.city'] = new RegExp(req.query.city, 'i');
    }
    if (req.query.state) {
      query['location.state'] = new RegExp(req.query.state, 'i');
    }
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }
    if (req.query.minPrice) {
      query['price.amount'] = { $gte: parseInt(req.query.minPrice) };
    }
    if (req.query.maxPrice) {
      query['price.amount'] = { ...query['price.amount'], $lte: parseInt(req.query.maxPrice) };
    }

    // Sort options
    let sort = { isPremium: -1, createdAt: -1 }; // Premium ads first, then newest
    if (req.query.sort === 'price_low') {
      sort = { 'price.amount': 1 };
    } else if (req.query.sort === 'price_high') {
      sort = { 'price.amount': -1 };
    } else if (req.query.sort === 'views') {
      sort = { views: -1 };
    }

    const ads = await Ad.find(query)
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .populate('user', 'name avatar isVerified')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Ad.countDocuments(query);

    res.json({
      success: true,
      data: ads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single ad
// @route   GET /api/ads/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .populate('user', 'name avatar isVerified phone createdAt');

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    // Increment views
    ad.views += 1;
    await ad.save();

    res.json({
      success: true,
      data: ad
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new ad
// @route   POST /api/ads
// @access  Private
router.post('/', protect, upload.array('images', 5), [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be 5-100 characters'),
  body('description').trim().isLength({ min: 20, max: 2000 }).withMessage('Description must be 20-2000 characters'),
  body('category').isMongoId().withMessage('Valid category ID required'),
  body('price.amount').optional().isNumeric().withMessage('Price must be a number'),
  body('location.city').trim().notEmpty().withMessage('City is required'),
  body('location.state').trim().notEmpty().withMessage('State is required'),
  body('contact.phone').isMobilePhone().withMessage('Valid phone number required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    // Verify category exists
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category'
      });
    }

    // Process uploaded images
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        images.push({
          url: `/uploads/ads/${file.filename}`,
          isMain: index === 0
        });
      });
    }

    const adData = {
      ...req.body,
      user: req.user.id,
      images
    };

    const ad = await Ad.create(adData);

    // Add ad to user's ads array
    await User.findByIdAndUpdate(req.user.id, {
      $push: { ads: ad._id }
    });

    const populatedAd = await Ad.findById(ad._id)
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .populate('user', 'name avatar isVerified');

    res.status(201).json({
      success: true,
      message: 'Ad created successfully',
      data: populatedAd
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update ad
// @route   PUT /api/ads/:id
// @access  Private
router.put('/:id', protect, upload.array('images', 5), async (req, res) => {
  try {
    let ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    // Check ownership
    if (ad.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this ad'
      });
    }

    // Process new uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file, index) => ({
        url: `/uploads/ads/${file.filename}`,
        isMain: index === 0 && ad.images.length === 0
      }));
      req.body.images = [...(ad.images || []), ...newImages];
    }

    ad = await Ad.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .populate('user', 'name avatar isVerified');

    res.json({
      success: true,
      message: 'Ad updated successfully',
      data: ad
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete ad
// @route   DELETE /api/ads/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    // Check ownership
    if (ad.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this ad'
      });
    }

    await ad.remove();

    // Remove ad from user's ads array
    await User.findByIdAndUpdate(ad.user, {
      $pull: { ads: ad._id }
    });

    res.json({
      success: true,
      message: 'Ad deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get user's ads
// @route   GET /api/ads/user/my-ads
// @access  Private
router.get('/user/my-ads', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const ads = await Ad.find({ user: req.user.id })
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Ad.countDocuments({ user: req.user.id });

    res.json({
      success: true,
      data: ads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;