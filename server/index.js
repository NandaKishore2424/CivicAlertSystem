const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Alert = require('./models/Alert');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/roadalerts', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// POST Route
app.post('/api/alerts', async (req, res) => {
  try {
    const newAlert = new Alert(req.body);
    await newAlert.save();
    res.status(201).json({ message: 'Alert saved successfully' });
  } catch (err) {
    console.error('Backend Error:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
