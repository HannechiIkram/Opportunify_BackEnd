var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const passport = require('passport');
const cors = require ('cors');
const { test, registerUser, loginUser, speedLimiter, loginLimiter, refreshAccessToken, forgotPassword, resetPassword } = require('../Controllers/UserController');

router.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173'
  })
)
router.get('/', test);
/* GET users listing. 
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/
router.post('/register', registerUser)
router.post('/login', loginLimiter, speedLimiter, loginUser)
router.post('/refresh-token', refreshAccessToken)

// Add the new routes
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

// Logout endpoint
router.post('/logout', (req, res) => {
  try {
    // Clear the refresh token cookie
    res.clearCookie('refreshToken', { httpOnly: true, secure: true });

    
      // Clear access token cookie
      res.clearCookie('accessToken', { httpOnly: true, secure: true });
    
    
      // Optionally, you can redirect to the home page or send a success message
      res.status(200).json({ message: 'Logout successful' });
    
    // Redirect the user to the home page
    res.redirect('/register');
  } catch (error) {
    console.error('Logout Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});/*
//Instagram authentication route
router.get('/auth/instagram', passport.authenticate('instagram'));
router.get('/auth/instagram/callback',
  passport.authenticate('instagram', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful Instagram authentication redirect logic
    res.redirect('/');
  }
);

// Facebook authentication route
router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful Facebook authentication redirect logic
    res.redirect('/');
  }
);

// Google authentication route
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful Google authentication redirect logic
    res.redirect('/');
  }
);

// LinkedIn authentication route
router.get('/auth/linkedin', passport.authenticate('linkedin'));
router.get('/auth/linkedin/callback',
  passport.authenticate('linkedin', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful LinkedIn authentication redirect logic
    res.redirect('/');
  }
);*/


module.exports = router;
