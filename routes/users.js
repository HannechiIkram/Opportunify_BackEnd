

var express = require("express");
var router = express.Router();

//const OpenAI = require("openai"); // Utilisation de require
const multer = require('multer');
//const uploadimage= multer({dest:'uploadsimages/'})
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploadsimages/') // Destination directory for uploaded files
  },
  
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname) // File naming convention
  }
});

const upload = multer({ storage: storage });

//const openai = new OpenAI({apiKey});
const { comparePassword, hashPassword } = require("../helpers/auth");

const User = require("../models/user");
const profileJobSeekerModel = require("../models/Profile_jobseeker");
const JobSeeker = require("../models/user-jobseeker");
const crypto = require("crypto");
const {
  acceptUserByEmail,
  rejectUserByEmail,
} = require("../Controllers/UserController");

const passport = require("passport");
const cors = require("cors");
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../Controllers/eventscont");
const { createUser } = require("../Controllers/UserController");
const authMiddleware = require("../midill/authMiddleware");
const { logoutUser } = require("../Controllers/UserController");
const {
  registerUserCompany,
  loginUser,
  speedLimiter,
  loginLimiter,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  getUserById,
  getProfileJobSeekerById,
} = require("../Controllers/UserController");

const {
  registerUser,
  getAllJobSeekerProfiles,
  updateProfileJobSeekerById,
  getProfileCompanyById,
} = require("../Controllers/UserController");
const {
  registerUserjobseeker,
  getUserJobSeekerProfile,
  getUserJobSeekers,
  getUserJobSeekerById,
} = require("../Controllers/User-jobseekerController");

//const {createUserCompany}=require('../Controllers/UserController');
const { getUsers } = require("../Controllers/UserController");
const { getUserCompany } = require("../Controllers/UserController");
const accessControl = require("../midill/accescontrol");

const authenticateUser = require("../midill/authMiddleware");

// Middleware for restricting access to certain routes
const isAdmin = accessControl(["admin"]);
const isCompany = accessControl(["company"]);
const isJobSeeker = accessControl(["job_seeker"]);

router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
router.post("/logout", authMiddleware, logoutUser);

router.get('/:id',authMiddleware, getUserById);

router.post("/registeruser", registerUser);

router.post("/registerjobseeker", registerUserjobseeker);

//
router.get("/jobSeekerProfile", getUserJobSeekerProfile);
router.get("/getProfileByUserId", getUserJobSeekerProfile);

router.get("/profile/:_id", getUserJobSeekerById);

router.get("/getProfileCompanyById/:profileId", getProfileCompanyById);

//router.get('/getAllProfileCompanies',getAllProfileCompanies);

router.get("/getProfileJobSeekerById/:profileId", getProfileJobSeekerById);
router.put("/updateProfileJobSeekerById/:profileid", async (req, res) => {
  try {
    const profileId = req.params.profileid;
    const updates = req.body; // The updates to be applied

    // Call the function to update the profile
    const updatedProfile = await updateProfileJobSeekerById(profileId, updates);

    res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get('/getAllJobSeekerProfiles',getAllJobSeekerProfiles);

router.get("/getUserJobSeekers", getUserJobSeekers);
router.get("/getUser/:userId", getUserById);

//
//router.post('/registercompany',  createUserCompany)
router.get("/", getUsers);
router.get("/company", authMiddleware, getUserCompany);
router.post("/registerCompany", registerUserCompany);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);




router.delete("/delete/:id",authMiddleware,isAdmin, async function (req, res) {
  try {
    const deleted = await User.findOneAndDelete({ _id: req.params.id });
    if (!deleted) {
      return res.status(404).json({ error: "user not found" });
    }
    res.status(200).json({ message: "user deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Accept user route
router.put("/accept/:email", authMiddleware,isAdmin, acceptUserByEmail);

// Reject user route
router.put("/reject/:email", authMiddleware, isAdmin,rejectUserByEmail);

// Route for initiating Facebook authentication
router.get("/auth/facebook", passport.authenticate("facebook"));
// Route for handling Facebook authentication callback
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/", // Redirect to home page after successful authentication
    failureRedirect: "/login", // Redirect to login page if authentication fails
  })
);


router.get("/search/company/:name", async function (req, res) {
  try {
    const name = req.params.name;
    const usercompany = await User.find({ name });
    res.json(usercompany);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.delete("/delete/:id", authMiddleware, async function (req, res) {
  try {
    const deleted = await User.findOneAndDelete({ _id: req.params.id });
    if (!deleted) {
      return res.status(404).json({ error: "user not found" });
    }
    res.status(200).json({ message: "user deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/dashboard", authMiddleware, isAdmin, (req, res) => {
  // This route can only be accessed by admin
});
router.get("/Job_offer", isCompany, (req, res) => {});
router.get("/job_application", isJobSeeker, (req, res) => {});
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

router.put('/profileJobSeeker_description/:profileId', async (req, res) => {
  try {
    const profileId = req.params.profileId;
    const { description } = req.body;

    // Find the profile job seeker by _id
    const profileJobSeeker = await profileJobSeekerModel.findById(profileId);

    if (!profileJobSeeker) {
      return res.status(404).json({ error: 'Profile job seeker not found' });
    }

    // Update the description field
    profileJobSeeker.description = description;

    // Save the updated profile job seeker
    await profileJobSeeker.save();

    return res.status(200).json({ message: 'Description added successfully', profileJobSeeker });
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/profileJobSeeker_git/:profileId', async (req, res) => {
  try {
    const profileId = req.params.profileId;
    const { git_url } = req.body; // Utilisez git_url ici

    // Find the profile job seeker by _id
    const profileJobSeeker = await profileJobSeekerModel.findById(profileId);

    if (!profileJobSeeker) {
      return res.status(404).json({ error: 'Profile job seeker not found' });
    }

    // Update the Git URL field avec git_url
    profileJobSeeker.git_url = git_url; // Utilisez git_url ici

    // Save the updated profile job seeker
    await profileJobSeeker.save();

    return res.status(200).json({ message: 'Git URL added successfully', profileJobSeeker });
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Configure multer for handling file uploads
// Configure multer for handling file uploads
/*
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/kiki"); // Define where to store uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Define file name
  },
});

const upload = multer({ storage: storage }); // Keep this declaration for handling file uploads

// Handle image upload
router.post("/upload", upload.single("image"), async (req, res) => {
  const imageUrl = req.file.path; // Assuming the image is stored in a local directory
  const userId = req.user.id; // Assuming you have authenticated the user and have their ID

  try {
    // Find the user by ID and update the image attribute
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.image = imageUrl;
    await user.save();

    res.json({ imageUrl: imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}); 
//////////////////////  const userId = req.user.id; // Assuming you have authenticated the user and have their ID
////////////////////// 
//////////////////////
router.post("/createUser",authMiddleware, upload.single("image"), createUser); */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const userData = req.body; // Updated user data sent in the request body

  try {
    // Find the user by ID and update all attributes
    const updatedUser = await User.findByIdAndUpdate(id, userData, {
      new: true,
    });

    // Check if the user was found and updated
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send the updated user data in the response
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// Route to block/unblock user
router.put("/block/:id", authMiddleware,isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Toggle the blocked status of the user
    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ message: "User blocked/unblocked successfully", user });
  } catch (error) {
    console.error("Error blocking/unblocking user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route pour débloquer un utilisateur
router.put("/unblock/:id", authMiddleware, isAdmin,async (req, res) => {
  const userId = req.params.id;

  try {
    // Trouver l'utilisateur dans la base de données
    const user = await User.findById(userId);

    // Vérifier si l'utilisateur existe
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Débloquer l'utilisateur en définissant isBlocked à false
    user.isBlocked = false;

    // Sauvegarder les modifications dans la base de données
    await user.save();

    // Renvoyer une réponse indiquant que l'utilisateur a été débloqué avec succès
    res.json({ message: "User unblocked successfully", user });
  } catch (error) {
    console.error("Error unblocking user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Créer un nouvel événement
router.post("/events", createEvent);

// Récupérer tous les événements
router.get("/events", getAllEvents);

// Récupérer un événement par son identifiant
router.get("/events/:id", getEventById);

// Mettre à jour un événement existant
router.put("/events/:id", updateEvent);

// Supprimer un événement
router.delete("/events/:id", deleteEvent);
/*
router.post('/addimage', upload.single('image'), function (req, res, next) {
  // Access the uploaded file using req.file
  if (!req.file) {
    return res.status(400).send('No files were uploaded.');
  }

  // File upload successful, send response
  res.send('File uploaded successfully.');
});
*/
// POST route to upload image for profile job seeker
router.post('/profileJobSeeker_image/:profileId', upload.single('image'), async (req, res) => {
  try {
    const profileId = req.params.profileId;

    // Find the profile job seeker by _id
    let profileJobSeeker = await profileJobSeekerModel.findById(profileId);

    if (!profileJobSeeker) {
      return res.status(404).json({ error: 'Profile job seeker not found' });
    }

    // Check if an image file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    // Update the image field with the path to the uploaded image file
    profileJobSeeker.image = req.file.path;

    // Save the updated profile job seeker
    profileJobSeeker = await profileJobSeeker.save();

    return res.status(200).json({ message: 'Image uploaded successfully', profileJobSeeker });
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});
const path = require('path');

router.get('/profileJS_image/:profileId', async (req, res) => {
  try {
    const profileId = req.params.profileId;

    // Find the profile job seeker by _id
    const profileJobSeeker = await profileJobSeekerModel.findById(profileId);

    if (!profileJobSeeker) {
      return res.status(404).json({ error: 'Profile job seeker not found' });
    }

    // Resolve the absolute path to the image file
    const imagePath = path.resolve(__dirname, '..', profileJobSeeker.image);

    // Send the image file as a response
    return res.sendFile(imagePath);
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route pour traiter les messages du chatbot
router.post("/chatbot", (req, res) => {
  const { message } = req.body;

  // Simulez la logique du chatbot ici ou connectez-vous à une plateforme comme Dialogflow
  const responseMessage = `Réponse à votre message : ${message}`;

  res.json({ response: responseMessage });
});
//sk-proj-2A1VCxcu4Da83j85gn3AT3BlbkFJUO1qN1XtirEIWlQf6z0y


/*async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Who won the world series in 2020?"},
        {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
        {"role": "user", "content": "Where was it played?"}],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0]);
}
main();*/
// Route pour approuver un utilisateur
router.post('/approve', async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (user) {
      user.isApproved = true;
      await user.save();
      res.status(200).json({ message: 'Utilisateur approuvé.' });
    } else {
      res.status(404).json({ message: 'Utilisateur introuvable.' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
module.exports = router;
