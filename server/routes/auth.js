// server/routes/auth.js
const express = require('express');
const passport = require('passport');
const router = express.Router();

// Initiate Twitter authentication
router.get('/twitter', passport.authenticate('twitter'));

// Twitter auth callback
router.get(
  '/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  (req, res) => {
    // Redirect to client URL after successful login (adjust to your deployed client URL)
    res.redirect('https://image-resizer-poster.vercel.app/');
    // res.redirect('https://your-client-name.vercel.app');
  }
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('http://localhost:3000');
    // res.redirect('https://your-client-name.vercel.app');
  });
});

// Endpoint to check authentication status
router.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

module.exports = router;
