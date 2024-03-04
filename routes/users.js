var express = require('express');
var router = express.Router();
const crypto = require('crypto');

const cors = require ('cors');
const { test, registerUser, loginUser , refreshAccessToken , forgotPassword , resetPassword } = require('../Controllers/UserController');

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
router.post('/login', loginUser)
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


module.exports = router;
