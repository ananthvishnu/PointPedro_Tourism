const mongoose = require('mongoose');

const tripPlaceSchema = new mongoose.Schema({
  place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
  visitOrder: { type: Number, required: true },
  estimatedVisitMinutes: { type: Number, default: 60 },
});

const tripSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, default: 'My Batticaloa Trip' },
    date: { type: Date, default: Date.now },
    places: [tripPlaceSchema],
    totalTravelTimeMinutes: { type: Number, default: 0 },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trip', tripSchema);
