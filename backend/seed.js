require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Place = require('./models/Place');

const places = [
  {
    name: 'Point Pedro Jetty',
    category: 'beach',
    description: 'Experience the coastal charm of Point Pedro Jetty, where fishing boats, ocean breezes, and beautiful northern seascapes create a peaceful seaside atmosphere. Enjoy coastal views, observe local fishing life, and discover the natural beauty of Sri Lanka’s northernmost town.',
    entranceFee: 0,
    openingTime: '00:00',
    closingTime: '00:00',
    estimatedVisitMinutes: 90,
    safetyGuidelines: [],
    seasonalWarnings: [],
    location: { latitude: 9.828156, longitude: 80.235416, address: 'Point Pedro, Jaffna District, Northern Province, Sri Lanka' },
    images: [{ url: 'https://thumbs.dreamstime.com/b/point-pedro-beach-jaffna-peninsula-northern-sri-lanka-asia-181857634.jpg', caption: 'Point Pedro Jetty' }],
    averageRating: 5.0,
    reviewCount: 34,
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/PointPedro_Tourism');
    console.log('Connected to MongoDB');

    // Check if admin exists, create only if not
    const adminExists = await User.findOne({ email: 'vishnurathan834@mail.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'vishnurathan834@mail.com',
        password: 'PointPedro001@',
        role: 'admin',
      });
      console.log('✅ Admin created: vishnurathan834@mail.com / PointPedro001@');
    } else {
      console.log('✅ Admin already exists');
    }

    // Check if demo tourist exists, create only if not
    const touristExists = await User.findOne({ email: 'tourist@demo.com' });
    if (!touristExists) {
      await User.create({
        name: 'Demo Tourist',
        email: 'tourist@demo.com',
        password: 'Tourist@1234',
        role: 'tourist',
      });
      console.log('✅ Demo tourist: tourist@demo.com / Tourist@1234');
    } else {
      console.log('✅ Demo tourist already exists');
    }

    // Add places only if they don't exist
    let addedCount = 0;
    for (const place of places) {
      const exists = await Place.findOne({ name: place.name });
      if (!exists) {
        await Place.create(place);
        addedCount++;
      }
    }
    console.log(`✅ ${addedCount} new places added (${places.length - addedCount} already existed)`);

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
