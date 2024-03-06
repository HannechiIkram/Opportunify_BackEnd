var express = require('express');
var router = express.Router();

const User = require("../models/user");

const { registerUser}=require('../Controllers/UserController');
const {registerUserjobseeker}=require('../Controllers/User-jobseekerController');
const {createUserCompany}=require('../Controllers/UserController');
/// for the dashboard
router.post('/registeruser',registerUser)
router.post('/registerjobseeker',  registerUserjobseeker)
router.post('/registercompany',  createUserCompany)
const { getUsers } = require('../Controllers/UserController')
const { getUserCompany } = require('../Controllers/UserController')



const crypto = require('crypto');
const passport = require('passport');
const cors = require ('cors');
const { test, registerUserCompany, loginUser, speedLimiter, loginLimiter, refreshAccessToken, forgotPassword, resetPassword } = require('../Controllers/UserController');

router.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173'
  })
)
////////

router.get('/', getUsers);
router.get('/company', getUserCompany);

router.delete("/delete/:id", async function (req, res) {
  try {
    const deleted = await User.findOneAndDelete({ _id: req.params.id });
    if (!deleted) {
      return res.status(404).json({ error: 'user not found' });
    }
    res.status(200).json({ message: 'user deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
/* GET users listing. 
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/
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

router.get("/search/company/:name", async function (req, res) {
  try {
    const name = req.params.name;
    const usercompany = await User.find({ name });
    res.json(usercompany);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

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
 