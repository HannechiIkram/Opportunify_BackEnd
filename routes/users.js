var express = require('express');
var router = express.Router();
const accessControl = require('../midill/accescontrol');

const crypto = require('crypto');
const passport = require('passport');
const cors = require ('cors');
const { test, registerUserCompany, loginUser, speedLimiter, loginLimiter, refreshAccessToken, forgotPassword, resetPassword } = require('../Controllers/UserController');

const { registerUser}=require('../Controllers/UserController');
const {registerUserjobseeker}=require('../Controllers/User-jobseekerController');
router.use(
    cors({
      credentials: true,
      origin: 'http://localhost:5173'
    })
  )
  

// Middleware for restricting access to certain routes
const isAdmin = accessControl(['admin']);
const isCompany = accessControl(['company']);
const isJobSeeker = accessControl(['job_seeker']);

router.post('/registeruser',registerUser)
router.post('/registerjobseeker',  registerUserjobseeker)



router.post('/registerCompany', registerUserCompany)
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
});

router.get('/dashboard', isAdmin, (req, res) => {
    // This route can only be accessed by admin
  });
  router.get('/job_offers', isJobSeeker, (req, res) => {
    // This route can only be accessed by admin
  });
  router.get('/job_application', isJobSeeker, (req, res) => {
    // This route can only be accessed by admin
  });
  
  /*
  router.get('/applications', isCompany, (req, res) => {
    // This route can only be accessed by company users
  });*:
  

/*
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
 