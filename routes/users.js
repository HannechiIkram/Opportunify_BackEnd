var express = require('express');
var router = express.Router();
const multer = require('multer');
const User = require("../models/user");
const crypto = require('crypto');
const passport = require('passport');
const cors = require ('cors');
const { registerUserCompany, loginUser, speedLimiter, loginLimiter, refreshAccessToken, forgotPassword, resetPassword ,getUserById} = require('../Controllers/UserController');
const { createEvent,getAllEvents,getEventById,updateEvent,deleteEvent} = require('../Controllers/eventscont');
const { registerUser}=require('../Controllers/UserController');
const { createUser }=require('../Controllers/UserController');

const {registerUserjobseeker}=require('../Controllers/User-jobseekerController');
//const {createUserCompany}=require('../Controllers/UserController');
const { getUsers } = require('../Controllers/UserController')
const { getUserCompany } = require('../Controllers/UserController')
const accessControl = require('../midill/accescontrol');
const { acceptUserByEmail, rejectUserByEmail } = require('../Controllers/UserController');
// Middleware for restricting access to certain routes
const isAdmin = accessControl(['admin']);
const isCompany = accessControl(['company']);
const isJobSeeker = accessControl(['job_seeker']);


router.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173'
  })
)
////
router.get('/:id', getUserById);


router.post('/registeruser',registerUser)

router.post('/registerjobseeker',  registerUserjobseeker)

//router.post('/registercompany',  createUserCompany)
router.get('/', getUsers);
router.get('/company', getUserCompany);
router.post('/registerCompany', registerUserCompany)
router.post('/login', loginLimiter, speedLimiter, loginUser)
router.post('/refresh-token', refreshAccessToken)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)



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


// Route for initiating Facebook authentication
router.get('/auth/facebook', passport.authenticate('facebook'));
// Route for handling Facebook authentication callback
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/', // Redirect to home page after successful authentication
  failureRedirect: '/login', // Redirect to login page if authentication fails
}));

router.post('/logout', (req, res) => {
  try {
    // Clear the refresh token cookie
    res.clearCookie('refreshToken', { httpOnly: true, secure: true });
    
    // Clear access token cookie
    res.clearCookie('accessToken', { httpOnly: true, secure: true });
    
    // Send a JSON response indicating successful logout
    res.status(200).json({ message: 'Logout successful' });
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
router.get('/dashboard', isAdmin, (req, res) => {
    // This route can only be accessed by admin
  });
  router.get('/Job_offer', isCompany, (req, res) => {
  });
  router.get('/job_application', isJobSeeker, (req, res) => {
  });
  /*router.get('/job_offers', isJobSeeker, (req, res) => {
  });*/
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
// Configure multer for handling file uploads
// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/kiki'); // Define where to store uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Define file name
  }
});

const upload = multer({ storage: storage }); // Keep this declaration for handling file uploads

// Handle image upload
router.post('/upload', upload.single('image'), async (req, res) => {
  const imageUrl = req.file.path; // Assuming the image is stored in a local directory
  const userId = req.user.id; // Assuming you have authenticated the user and have their ID

  try {
    // Find the user by ID and update the image attribute
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.image = imageUrl;
    await user.save();

    res.json({ imageUrl: imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//////////////////////  const userId = req.user.id; // Assuming you have authenticated the user and have their ID
///////////////////////////
//////////////////////
router.post('/createUser', upload.single('image'), createUser);
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const userData = req.body; // Updated user data sent in the request body

  try {
    // Find the user by ID and update all attributes
    const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });

    // Check if the user was found and updated
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send the updated user data in the response
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// Route to block/unblock user
router.put('/block/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Toggle the blocked status of the user
    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ message: 'User blocked/unblocked successfully', user });
  } catch (error) {
    console.error('Error blocking/unblocking user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route pour débloquer un utilisateur
router.put('/unblock/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    // Trouver l'utilisateur dans la base de données
    const user = await User.findById(userId);

    // Vérifier si l'utilisateur existe
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Débloquer l'utilisateur en définissant isBlocked à false
    user.isBlocked = false;

    // Sauvegarder les modifications dans la base de données
    await user.save();

    // Renvoyer une réponse indiquant que l'utilisateur a été débloqué avec succès
    res.json({ message: 'User unblocked successfully', user });
  } catch (error) {
    console.error('Error unblocking user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Créer un nouvel événement
router.post('/events',createEvent);

// Récupérer tous les événements
router.get('/events', getAllEvents);

// Récupérer un événement par son identifiant
router.get('/events/:id', getEventById);

// Mettre à jour un événement existant
router.put('/events/:id',updateEvent);

// Supprimer un événement
router.delete('/events/:id', deleteEvent);
// Route pour accepter un utilisat


module.exports = router;
 