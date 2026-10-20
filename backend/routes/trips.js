const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const Place = require('../models/Place');
const { protect } = require('../middleware/auth');

// Calculate travel time between two coordinates (Haversine formula, avg 40km/h)
function calcTravelMinutes(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const distKm = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round((distKm / 40) * 60); // 40 km/h avg speed
}

// GET /api/trips - get user's trips
router.get('/', protect, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user._id })
      .populate('places.place')
      .sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/trips/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id }).populate(
      'places.place'
    );
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/trips - create new trip
router.post('/', protect, async (req, res) => {
  try {
    const { name, date, placeIds, notes } = req.body;
    if (!placeIds || placeIds.length === 0)
      return res.status(400).json({ message: 'At least one place required' });

    const places = await Place.find({ _id: { $in: placeIds } });
    const orderedPlaces = placeIds.map((id, idx) => {
      const place = places.find((p) => p._id.toString() === id);
      return { place: id, visitOrder: idx + 1, estimatedVisitMinutes: place?.estimatedVisitMinutes || 60 };
    });

    // Calculate total travel time between consecutive places
    let totalTravelTime = 0;
    for (let i = 0; i < places.length - 1; i++) {
      const p1 = places[i];
      const p2 = places[i + 1];
      if (p1?.location && p2?.location) {
        totalTravelTime += calcTravelMinutes(
          p1.location.latitude, p1.location.longitude,
          p2.location.latitude, p2.location.longitude
        );
      }
    }

    const trip = await Trip.create({
      user: req.user._id,
      name: name || 'My Batticaloa Trip',
      date: date || new Date(),
      places: orderedPlaces,
      totalTravelTimeMinutes: totalTravelTime,
      notes,
    });

    const populated = await Trip.findById(trip._id).populate('places.place');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/trips/:id - update trip
router.put('/:id', protect, async (req, res) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    ).populate('places.place');
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/trips/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json({ message: 'Trip deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
