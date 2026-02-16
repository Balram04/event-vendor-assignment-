const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const { auth } = require('../middlewares/auth');
const { validateSignUpData, validateLoginData } = require('../utils/validation');

const router = express.Router();

// Signup 
router.post('/signup', async (req, res) => {
  try {
    validateSignUpData(req); // Validate signup data for perfect data integrity
    
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });

    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashed, role });

    const responseMessage = role === 'vendor' 
      ? 'User registered successfully. Your vendor profile will be created by the administrator. You will be able to login once your profile is complete.'
      : 'User registered successfully';

    res.status(201).json({ 
      message: responseMessage, 
      user: { id: user._id, role: user.role },
      requiresProfileSetup: role === 'vendor'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    // Validate login data
    validateLoginData(req);
    
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('User found:', { id: user._id, email: user.email, role: user.role });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if vendor profile exists for vendor users
    if (user.role === 'vendor') {
      const vendorProfile = await Vendor.findOne({ userId: user._id });
      if (!vendorProfile) {
        console.log('Vendor profile not found for user:', user._id);
        return res.status(403).json({ 
          message: 'Your vendor profile has not been created yet. Please contact the administrator to complete your profile setup.',
          profileIncomplete: true 
        });
      }
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('JWT created for user:', { userId: user._id, role: user.role });

    // Set HTTP-only cookie
    const cookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: '/' // Cookie available on all routes
    };
    
    res.cookie('token', token, cookieOptions);
    
    console.log('Cookie set for user:', user.email);
    
    // Don't send token in response body - it's in the HTTP-only cookie
    res.json({ 
      message: 'Login successful',
      userId: user._id, 
      role: user.role 
    });
    
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Check current authentication status
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json({ 
      authenticated: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 0 // Expire immediately
  });
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
