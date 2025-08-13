const express = require('express');
const Ad = require('../models/Ad');

const router = express.Router();

// @desc    Get popular cities
// @route   GET /api/locations/cities
// @access  Public
router.get('/cities', async (req, res) => {
  try {
    const cities = await Ad.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$location.city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
      { $project: { name: '$_id', count: 1, _id: 0 } }
    ]);

    res.json({
      success: true,
      data: cities
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get states
// @route   GET /api/locations/states
// @access  Public
router.get('/states', async (req, res) => {
  try {
    const states = await Ad.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$location.state', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { name: '$_id', count: 1, _id: 0 } }
    ]);

    res.json({
      success: true,
      data: states
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