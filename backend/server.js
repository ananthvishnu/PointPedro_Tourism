
// Code for backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
// app.use(cors());

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://point-pedro-tourism.vercel.app",
  "https://point-pedro-tourism-oesd.vercel.app/",
  "https://point-pedro-tourism.vercel.app/api/places?limit=6"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test route
app.get('/', (req, res) => {
  res.send('Welcome to PointPedro-Tourism API!');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/places', require('./routes/places'));
app.use('/api/trips', require('./routes/trips'));
app.use('/api/reviews', require('./routes/reviews'));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PointPedro-Tourism server is running!',
    database: mongoose.connection.readyState === 1
      ? 'Connected'
      : 'Not connected'
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb+srv://vishnurathan834_db_user:8Z0gxqj2aSrFUIo7@cluster0.nes4my0.mongodb.net/PointPedro_Tourism')
  .then(() => {
    console.log(`✅ MongoDB connected ${process.env.MONGODB_URI}`);
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

module.exports = app;