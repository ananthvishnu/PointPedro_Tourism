const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['beach', 'temple', 'heritage', 'food', 'lagoon', 'park', 'other'],
    },
    description: { type: String, required: true },
    entranceFee: { type: Number, default: 0 },
    openingTime: { type: String, default: '06:00' },
    closingTime: { type: String, default: '18:00' },
    estimatedVisitMinutes: { type: Number, default: 60 },
    safetyGuidelines: [{ type: String }],
    seasonalWarnings: [{ type: String }],
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      address: { type: String },
    },
    images: [{ url: String, caption: String }],
    isActive: { type: Boolean, default: true },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

placeSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Place', placeSchema);
