const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  releaseYear: { type: Number, required: true },
  genre: [{ type: String, required: true }],
  rating: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  description: { type: String },
  poster: { type: String },
  trailer: { type: String },
});

module.exports = mongoose.model('Movie', movieSchema);
