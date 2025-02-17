// server/app.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');

const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

// Middleware
app.use(
  cors({
    // You can add your deployed client URL(s) here
    origin: ['https://your-client-name.vercel.app', 'http://localhost:3000'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware (use secure: false in development)
app.use(
  session({
    secret: 'your_secret_key', // change for production
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
require('./config/passport')(passport);

// Routes
app.use('/auth', authRoutes);
app.use('/upload', uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
