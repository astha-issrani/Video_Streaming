const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      process.env.CLIENT_URL,
      'http://localhost:5173',
      'https://video-streaming-livid-eight.vercel.app'
    ];
    if (!origin || origin.startsWith('chrome-extension://') || allowed.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin); // add this line
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/videos', require('./routes/videos'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));