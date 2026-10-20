const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

reviewSchema.index({ place: 1, user: 1 }, { unique: true });

// Update place average rating after save
reviewSchema.post('save', async function () {
  const Place = require('./Place');
  const stats = await this.constructor.aggregate([
    { $match: { place: this.place } },
    { $group: { _id: '$place', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  if (stats.length > 0) {
    await Place.findByIdAndUpdate(this.place, {
      averageRating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count,
    });
  }
});

module.exports = mongoose.model('Review', reviewSchema);
