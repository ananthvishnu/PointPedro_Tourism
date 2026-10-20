require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const Place = require('./models/Place');

async function exportToSeed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/PointPedro_Tourism');
    console.log('Connected to MongoDB');

    // Get all active places from MongoDB
    const places = await Place.find({ isActive: true }).lean();
    
    if (places.length === 0) {
      console.log('❌ No places found in MongoDB');
      process.exit(1);
    }

    // Format places data for seed.js
    const placesCode = places.map(p => `  {
    name: '${p.name}',
    category: '${p.category}',
    description: '${p.description.replace(/'/g, "\\'")}',
    entranceFee: ${p.entranceFee},
    openingTime: '${p.openingTime}',
    closingTime: '${p.closingTime}',
    estimatedVisitMinutes: ${p.estimatedVisitMinutes},
    safetyGuidelines: [${p.safetyGuidelines.map(s => `'${s.replace(/'/g, "\\'")}'`).join(', ')}],
    seasonalWarnings: [${p.seasonalWarnings.map(s => `'${s.replace(/'/g, "\\'")}'`).join(', ')}],
    location: { latitude: ${p.location.latitude}, longitude: ${p.location.longitude}, address: '${p.location.address.replace(/'/g, "\\'")}' },
    images: [${p.images.map(img => `{ url: '${img.url}', caption: '${img.caption.replace(/'/g, "\\'")}' }`).join(', ')}],
    averageRating: ${p.averageRating},
    reviewCount: ${p.reviewCount},
  },`).join('\n');

    // Read current seed.js
    const seedFile = fs.readFileSync('./seed.js', 'utf8');
    
    // Replace places array
    const updatedSeed = seedFile.replace(
      /const places = \[[\s\S]*?\];/,
      `const places = [\n${placesCode}\n];`
    );

    // Write back to seed.js
    fs.writeFileSync('./seed.js', updatedSeed);

    console.log(`✅ Updated seed.js with ${places.length} places from MongoDB`);
    console.log('📝 Next time you run: npm run seed');
    console.log('   It will preserve all your changes!');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Export error:', err.message);
    process.exit(1);
  }
}

exportToSeed();
