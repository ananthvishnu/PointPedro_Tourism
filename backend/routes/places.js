const express = require('express');
const router = express.Router();
const Place = require('../models/Place');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/places - get all places with optional filters
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };

    if (category && category !== 'all') query.category = category;
    if (search) query.$text = { $search: search };

    const skip = (page - 1) * limit;
    const [places, total] = await Promise.all([
      Place.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Place.countDocuments(query),
    ]);

    res.json({ places, total, pages: Math.ceil(total / limit), page: Number(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/places/:id
router.get('/:id', async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: 'Place not found' });
    res.json(place);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/places (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const place = await Place.create(req.body);
    res.status(201).json(place);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/places/:id (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const place = await Place.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!place) return res.status(404).json({ message: 'Place not found' });
    res.json(place);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/places/:id (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const place = await Place.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!place) return res.status(404).json({ message: 'Place not found' });
    res.json({ message: 'Place removed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
