const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  fileKey:     { type: String, required: true },   // R2 object key  
  thumbnail:   { type: String },
  uploader:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  views:       { type: Number, default: 0 },
  size:        { type: Number },                   // bytes
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);