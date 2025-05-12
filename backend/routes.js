const express = require('express');
const User = require('./models/user');
const bcrypt = require('bcryptjs');  // <-- Import bcryptjs
const jwt = require('jsonwebtoken');

const router = express.Router();

// ------------------------------
// User Signup Route
// ------------------------------
router.post('/signup/user', async (req, res) => {
  const { email, name, password, phoneNumber, location } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Create a new user
    const newUser = new User({
      email,
      name,
      password,  // Password will be hashed automatically due to the schema middleware
      phoneNumber,
      location,
      role: 'user', // Normal user role
    });

    // Save user (password will be hashed automatically by the schema's pre-save middleware)
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ message: 'User created successfully', token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ------------------------------
// Government Official Signup Route
// ------------------------------
router.post('/signup/official', async (req, res) => {
  const { email, name, password, phoneNumber, location, verificationDoc } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Validate that a verification document is provided for officials
    if (!verificationDoc) {
      return res.status(400).json({ message: 'Verification document is required for government officials' });
    }

    // Create a new government official
    const newUser = new User({
      email,
      name,
      password,  // Password will be hashed automatically due to the schema middleware
      phoneNumber,
      location,
      role: 'official', // Official role
      verificationDoc,  // Required only for officials
    });

    // Save user (password will be hashed automatically by the schema's pre-save middleware)
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ message: 'Government official created successfully', token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ------------------------------
// User Signin Route
// ------------------------------
router.post('/signin/user', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, role: 'user' });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'User sign-in successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ------------------------------
// Government Official Signin Route
// ------------------------------
router.post('/signin/official', async (req, res) => {
  const { email, password } = req.body;

  try {
    const official = await User.findOne({ email, role: 'official' });
    if (!official) return res.status(404).json({ message: 'Official not found' });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, official.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign({ userId: official._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Official sign-in successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
