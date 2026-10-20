require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Place = require('./models/Place');

const places = [
  {
    name: 'Kallady Beach',
    category: 'beach',
    description: 'A beautiful and peaceful coastal spot in Batticaloa with soft sand, calm waves and stunning sunrise views. Perfect for early morning walks or relaxing by the sea. Less crowded than most beaches, with local fishermen and boats adding to the scenic charm.',
    entranceFee: 0,
    openingTime: '00:00',
    closingTime: '00:00',
    estimatedVisitMinutes: 90,
    safetyGuidelines: [],
    seasonalWarnings: [],
    location: { latitude: 7.7186502, longitude: 81.718903, address: 'Kallady, Batticaloa, Sri Lanka' },
    images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQZiujBzGHktvkVc4QIir-NxBsO5lImeXLgA&s', caption: 'Kallady Beach' }],
    averageRating: 4.3,
    reviewCount: 12,
  },
  {
    name: 'Batticaloa Lighthouse',
    category: 'heritage',
    description: 'A historic colonial-era lighthouse located near the Batticaloa Lagoon. Visitors can climb narrow steel ladders to the top for a bird\'s eye view of Batticaloa and its surroundings. Boat rides are also available nearby to explore the lagoon. A symbol of Batticaloa\'s maritime heritage.',
    entranceFee: 0,
    openingTime: '07:00',
    closingTime: '19:00',
    estimatedVisitMinutes: 45,
    safetyGuidelines: [],
    seasonalWarnings: [],
    location: { latitude: 7.7548599, longitude: 81.6853888, address: 'QM3P+W5R, Batticaloa, Sri Lanka' },
    images: [{ url: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/f5/28/0e/photo2jpg.jpg?w=900&h=500&s=1', caption: 'Batticaloa Lighthouse' }],
    averageRating: 4.5,
    reviewCount: 8,
  },
  {
    name: 'Batticaloa Lagoon',
    category: 'lagoon',
    description: 'A stunning 56km long natural lagoon stretching from Eravur to Kalmunai with 8 islands. Known for boat rides, beautiful sunsets, and fresh lagoon fish and prawns. A unique and well-preserved natural beauty spot in eastern Sri Lanka.',
    entranceFee: 0,
    openingTime: '00:00',
    closingTime: '00:00',
    estimatedVisitMinutes: 120,
    safetyGuidelines: [],
    seasonalWarnings: [],
    location: { latitude: 7.566667, longitude: 81.683333, address: 'Batticaloa Lagoon, Batticaloa' },
    images: [{ url: 'https://live.staticflickr.com/3398/3501008277_8a9353c36d_b.jpg', caption: 'Batticaloa Lagoon at sunset' }],
    averageRating: 4.6,
    reviewCount: 20,
  },
  {
    name: 'Pasikuda Beach',
    category: 'beach',
    description: 'One of Sri Lanka\'s most beautiful beaches on the eastern coast, famous for its incredibly shallow, calm turquoise waters and soft white sand. Ideal for families and swimming. Lifeguards are on duty. Best visited early morning to avoid the strong midday sun.',
    entranceFee: 0,
    openingTime: '06:00',
    closingTime: '19:00',
    estimatedVisitMinutes: 180,
    safetyGuidelines: ['Apply sunscreen', 'Hydrate frequently', 'Avoid swimming far from shore'],
    seasonalWarnings: ['Best visited May–September; rough seas during monsoon season'],
    location: { latitude: 7.9299939, longitude: 81.5611852, address: 'Pasikuda, Eastern Province, Sri Lanka' },
    images: [{ url: 'https://storyofsrilanka.com/images/sri-lanka-guide/pasikudah-beach/02.jpg', caption: 'Pasikuda crystal-clear waters' }],
    averageRating: 4.8,
    reviewCount: 35,
  },
  {
    name: 'Street Food Stalls Kattankudy',
    category: 'food',
    description: 'A bustling street food hub in Kattankudy open from evening till late night. Offers an incredible variety including gelatos, bubble teas, sandwiches, waffles, pizza bowls, brownies, chai, seafood, corn dogs, mojitos and more — all at very affordable prices.',
    entranceFee: 0,
    openingTime: '17:00',
    closingTime: '00:00',
    estimatedVisitMinutes: 30,
    safetyGuidelines: [],
    seasonalWarnings: [],
    location: { latitude: 7.6863615, longitude: 81.7275062, address: 'Telecom Rd, Kattankudy, Sri Lanka' },
    images: [{ url: 'https://sattarelite.com/build/assets/kattankudy-street-food-fwQh5GEh.webp', caption: 'Street Food Stalls Kattankudy' }],
    averageRating: 4.2,
    reviewCount: 5,
  },
  {
    name: 'Sittandy Murugan Kovil',
    category: 'temple',
    description: 'One of the ancient and sacred Murugan temples in the Batticaloa district, located along the Trincomalee Highway. A deeply devotional site known for its spiritual significance and traditional Hindu festivals including Kandhasashti celebrations.',
    entranceFee: 0,
    openingTime: '06:00',
    closingTime: '22:00',
    estimatedVisitMinutes: 60,
    safetyGuidelines: [],
    seasonalWarnings: [],
    location: { latitude: 7.8212524, longitude: 81.5498727, address: 'Trincomalee Hwy, Siththandy, Sri Lanka' },
    images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU2AVaSmvgK1kyLuo1Oea4eADmqFBjwiIWCA&s', caption: '' }],
    averageRating: 3.9,
    reviewCount: 6,
  },
  {
    name: 'Kalappu Food Court - Mr. Black',
    category: 'food',
    description: 'A newly opened food court in Batticaloa located near the lagoon. Offers a wide variety of main meals, fast food, snacks, desserts and beverages. Best visited around 6PM to enjoy the sunset at the nearby lagoon before dinner.',
    entranceFee: 0,
    openingTime: '07:00',
    closingTime: '00:00',
    estimatedVisitMinutes: 30,
    safetyGuidelines: [],
    seasonalWarnings: [],
    location: { latitude: 7.7269637, longitude: 81.6863326, address: 'Slaughter House Lake Rd, Batticaloa, Sri Lanka' },
    images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjtZ8j7nVHzE5X2Lc_cIQgvvs3SvUVWTZqvQ&s', caption: 'Kalappu Food Court - Mr. Black' }],
    averageRating: 4.4,
    reviewCount: 9,
  },
  {
    name: 'Kattankudy Food Court',
    category: 'food',
    description: 'A popular open-air food court in the heart of Kattankudy. Offers a wide variety of street food including kottu, junk food, ice cream, rice and beverages. Dining tables are placed in the street, giving a lively atmosphere especially in the evenings',
    entranceFee: 0,
    openingTime: '16:00',
    closingTime: '00:00',
    estimatedVisitMinutes: 90,
    safetyGuidelines: [],
    seasonalWarnings: [],
    location: { latitude: 7.6801666, longitude: 81.7285703, address: 'Sir Razeek Fareed Mawatha, Kattankudy, Sri Lanka' },
    images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqMHxKYQhDEd-256Voxl7bG0wJ-7xVFf5vGw&s', caption: '' }],
    averageRating: 4.1,
    reviewCount: 4,
  },
  {
    name: 'Sri Mamangeswarar Kovil (Mamangam Temple)',
    category: 'temple',
    description: 'An ancient and historically significant Shiva temple in Batticaloa, believed to be the site where Lord Rama worshipped Shiva during the Ramayana era. A must-visit religious landmark with rich cultural heritage and festival celebrations.',
    entranceFee: 0,
    openingTime: '06:00',
    closingTime: '18:00',
    estimatedVisitMinutes: 60,
    safetyGuidelines: [],
    seasonalWarnings: [],
    location: { latitude: 7.7358781, longitude: 81.6952669, address: 'PMPW+942, Batticaloa, Sri Lanka' },
    images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUVLiFL78BxouHhjEXYkLHxQeP4pTIOarN0A&s', caption: 'Sri Mamangeswarar Kovil (Mamangam Temple)' }],
    averageRating: 5,
    reviewCount: 1,
  },
  {
    name: 'Fort Park Batticaloa',
    category: 'park',
    description: 'A peaceful and well-maintained park located near the Batticaloa Lagoon. Features a kids\' play area, exercise facilities, and open space for walking and jogging. Best visited in the evening or early morning for sunrise views.',
    entranceFee: 0,
    openingTime: '00:00',
    closingTime: '00:00',
    estimatedVisitMinutes: 60,
    safetyGuidelines: [],
    seasonalWarnings: [],
    location: { latitude: 7.7087965, longitude: 81.7008071, address: 'PP52+G87, Batticaloa, Sri Lanka' },
    images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWIxzpp26P004jb-Es1dNn65EIIqBHYiEcgA&s', caption: 'Fort Park Batticaloa' }],
    averageRating: 5,
    reviewCount: 1,
  },
  {
    name: 'Batticaloa Lagoon Park',
    category: 'park',
    description: 'A peaceful nature park situated along the Batticaloa Lagoon. Features benches, a children\'s play area and a 200m walkway. Popular for morning walks, jogging, and watching beautiful sunsets.',
    entranceFee: 0,
    openingTime: '00:00',
    closingTime: '00:00',
    estimatedVisitMinutes: 60,
    safetyGuidelines: [],
    seasonalWarnings: [],
    location: { latitude: 7.7112555, longitude: 81.6895526, address: '59, 67 Lake Rd No. 1, Batticaloa, Sri Lanka' },
    images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDkw9Lo9sDphCs4L62i5RL1D5unXwchac-sA&s', caption: 'Batticaloa Lagoon Park' }],
    averageRating: 5,
    reviewCount: 1,
  },
  {
    name: 'Batticaloa Gandhi Park',
    category: 'park',
    description: 'A scenic lagoon-side park in Batticaloa dedicated to Mahatma Gandhi, featuring a golden Gandhi statue. Ideal for evening walks, jogging, and relaxing by the waterfront. Small vendors available for snacks.',
    entranceFee: 0,
    openingTime: '08:00',
    closingTime: '22:00',
    estimatedVisitMinutes: 60,
    safetyGuidelines: [],
    seasonalWarnings: [],
    location: { latitude: 7.7138029, longitude: 81.6989004, address: 'Bazaar St, Batticaloa, Sri Lanka' },
    images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQauJYLgJ0ArO_0PylBqynTpdnS83erIz8A-w&s', caption: 'Batticaloa Gandhi Park' }],
    averageRating: 5,
    reviewCount: 1,
  },
  {
    name: 'Al-Aqsa Grand Jumma Masjid',
    category: 'temple',
    description: 'A magnificent and peaceful mosque in Kattankudy, built as an exact replica of Masjid al-Aqsa in Jerusalem. Known for its impressive Islamic architecture, serene spiritual atmosphere and blue decorative interiors. Welcoming to all visitors including non-Muslims. An important religious and community landmark in the eastern province of Sri Lanka.',
    entranceFee: 0,
    openingTime: '04:00',
    closingTime: '22:00',
    estimatedVisitMinutes: 60,
    safetyGuidelines: [],
    seasonalWarnings: [],
    location: { latitude: 7.6829121, longitude: 81.7341071, address: 'Beach Road, New Kattankudy Jumma Masjid, 03, Kattankudy, Sri Lanka' },
    images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3ipte-m1WHG_bW4n9qd2TRuJcJBNv-veOVg&s', caption: '' }],
    averageRating: 5,
    reviewCount: 1,
  },
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
