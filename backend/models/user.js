const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String },
  location: { type: String },
  verificationDoc: { type: String }, // Only for government officials
  role: {
    type: String,
    enum: ['user', 'official'],
    required: true,
  },
});

// Hash password before saving (if modified)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
