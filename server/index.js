// Basic Express server setup
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

app.use(cors());
app.use(express.json());

const MOVIES_FILE = path.join(__dirname, 'movies.json');
const USERS_FILE = path.join(__dirname, 'users.json');

function readMovies() {
  return JSON.parse(fs.readFileSync(MOVIES_FILE, 'utf-8'));
}
function writeMovies(movies) {
  fs.writeFileSync(MOVIES_FILE, JSON.stringify(movies, null, 2));
}

function readUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
}
function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Auth: Register
const User = require('./models/User');
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  try {
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ error: 'Username already exists' });
    }
    const hashedPassword = bcrypt.hashSync(password, 8);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Auth: Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  try {
    const user = await User.findOne({ username });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, username: user.username, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, isAdmin: user.isAdmin });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Get all movies
const Movie = require('./models/Movie');
app.get('/api/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

// Add a new movie (protected)
app.post('/api/movies', authMiddleware, async (req, res) => {
  const { title, releaseYear, genre, rating, featured, description, poster, trailer } = req.body;
  if (!title || !releaseYear || !genre) {
    return res.status(400).json({ error: 'Title, releaseYear, and genre are required' });
  }
  try {
    const movie = new Movie({ title, releaseYear, genre, rating, featured, description, poster, trailer });
    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add movie' });
  }
});

// Update a movie (protected)
app.put('/api/movies/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, releaseYear, genre, rating, featured, description, poster, trailer } = req.body;
  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    if (title !== undefined) movie.title = title;
    if (releaseYear !== undefined) movie.releaseYear = releaseYear;
    if (genre !== undefined) movie.genre = genre;
    if (rating !== undefined) movie.rating = rating;
    if (featured !== undefined) movie.featured = featured;
    if (description !== undefined) movie.description = description;
    if (poster !== undefined) movie.poster = poster;
    if (trailer !== undefined) movie.trailer = trailer;
    await movie.save();
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update movie' });
  }
});

// Delete a movie (protected)
app.delete('/api/movies/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Movie.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(deleted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete movie' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
