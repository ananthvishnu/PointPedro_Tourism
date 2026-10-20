const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check token
    if (!token) {
      return res.status(401).json({
        message: 'Not authorized, no token',
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'pointpedro_tourism_secret_key_2026'
    );

    // Find user
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        message: 'User not found',
      });
    }

    // Continue to the next middleware or route handler
    next();

  } catch (err) {
    return res.status(401).json({
      message: 'Not authorized, token failed',
    });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }

  return res.status(403).json({
    message: 'Admin access required',
  });
};