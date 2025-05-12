const express = require('express');
const mongoose = require('mongoose');
const Alert = require('./models/Alert'); // Make sure you have a model like this

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/alerts', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(express.json());

// Route to fetch alert details from MongoDB
app.get('/api/alerts/:id', async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id); // Assuming you're passing alert ID as URL param
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
