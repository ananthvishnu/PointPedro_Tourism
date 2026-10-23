const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'pointpedro_tourism_secret_key_2026', { expiresIn: '7d' });

// POST /api/auth/register
router.post(
  '/register',
  upload.single('profileImage'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be 6+ characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    let savedImagePath = '';
    try {
      const { name, email, password } = req.body;
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ message: 'Email already registered' });
     if (req.file) {
        savedImagePath =
          `/uploads/profiles/${req.file.filename}`;
      }
      const user = await User.create({ name, email, password,profileImage: savedImagePath });
      res.status(201).json({ token: signToken(user._id), user });
    } catch (err) {
      // Remove uploaded file if registration fails
      if (req.file) {
        const fs = require('fs');
        const path = require('path');

        fs.unlink(
          path.join(__dirname, '../uploads/profiles', req.file.filename)
        );
      }
      res.status(500).json({ message: err.message });
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      res.json({ token: signToken(user._id), user });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
