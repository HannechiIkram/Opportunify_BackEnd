const UserModel = require('../models/user'); 
const UserJobSeekerModel = require('../models/user-jobseeker'); 
const { comparePassword, hashPassword } = require('../helpers/auth');
const multer = require('multer');
//const upload = multer({ dest: 'uploadp/' });
// Sign up endpoint (register du job seeker)
const { createNotification } = require('./job-offerController'); // Fonction de création de notifications

//
const  ProfileJobSeekerModel=require('../models/Profile_jobseeker');

const registerUserjobseeker = async (req, res) => {
  try {
    const { name, lastname, birthdate, email, phone, address, password, role_jobseeker, confirmPassword } = req.body;

    // Required field validation
    if (!name || !lastname || !birthdate || !email || !phone || !address || !password || !role_jobseeker || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Password validation
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit.' });
    }

    // Name validation
    const nameRegex = /^[A-Za-z]+$/;
    const minNameLength = 2;
    const maxNameLength = 10;

    if (!nameRegex.test(name)) {
      return res.status(400).json({ error: 'Name must contain only alphabetic characters.' });
    }

    if (name.length < minNameLength || name.length > maxNameLength) {
      return res.status(400).json({ error: `Name must be between ${minNameLength} and ${maxNameLength} characters long.` });
    }

    if (!nameRegex.test(lastname)) {
      return res.status(400).json({ error: 'Last name must contain only alphabetic characters.' });
    }

    if (lastname.length < minNameLength || lastname.length > maxNameLength) {
      return res.status(400).json({ error: `Last name must be between ${minNameLength} and ${maxNameLength} characters long.` });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    // Address validation
    if (!address || address.length < 5) {
      return res.status(400).json({ error: 'Address must be at least 5 characters long.' });
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Password and confirm password do not match.' });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already taken' });
    }

    // Hash the password and create a new user
    const hashedPassword = await hashPassword(password);

    const newUser = await UserModel.create({
      email,
      password: hashedPassword,
      role: 'job_seeker',
      name,
      lastname,
      birthdate,
      phone,
      address,
      role_jobseeker,
    });

    const newUserJobSeeker = await UserJobSeekerModel.create({
      name,
      email,
      password: hashedPassword,
      lastname,
      birthdate,
      phone,
      address,
      role_jobseeker,
    });

    // Create a notification for admin
    const adminUser = await UserModel.findOne({ role: 'admin' });
    if (adminUser) {
      const message = `A new user has registered: ${newUser.name}`;
      try {
        await createNotification({ body: { userId: adminUser._id, message } });
      } catch (error) {
        console.error('Error in createNotification:', error);
      }
    }

    return res.status(201).json({ msg: "User added successfully", newUser, newUserJobSeeker });
  } catch (error) {
    console.error('Error in registerUserJobseeker:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



const getUserJobSeekerProfile = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming you pass the user ID as a URL parameter

    // Retrieve job seeker profile from UserJobSeekerModel using the user ID
    const userJobSeeker = await UserJobSeekerModel.findOne({ userId });

    if (!userJobSeeker) {
      return res.status(404).json({ error: 'Job Seeker profile not found' });
    }

    // Return the job seeker profile data
    res.status(200).json({ userJobSeeker });
  } catch (error) {
    console.error('Error fetching job seeker profile:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

{/*
const getUserJobSeekerProfile = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming you pass the user ID as a URL parameter

    // Retrieve user information including profile using the user ID
    const user = await UserModel.findById(userId).populate('profile');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user's profile data
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
*/}


const getUserJobSeekers = async (req, res) => {
  try {
    // Récupérer tous les job seekers de la base de données
    const jobSeekers = await UserJobSeekerModel.find();

    // Vérifier si aucun job seeker n'est trouvé
    if (!jobSeekers || jobSeekers.length === 0) {
      return res.status(404).json({ error: 'No job seekers found' });
    }

    // Retourner les job seekers
    res.status(200).json({ jobSeekers });
  } catch (error) {
    console.error('Error fetching job seekers:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getUserJobSeekerById = async (req, res) => {
  try {
    const userId = req.params._id; // Récupérer l'ID du job seeker depuis les paramètres de l'URL

    // Rechercher le job seeker par son ID dans la base de données
    const jobSeeker = await UserJobSeekerModel.findById(userId);

    // Vérifier si aucun job seeker n'est trouvé
    if (!jobSeeker) {
      return res.status(404).json({ error: 'Job seeker not found' });
    }

    // Retourner le job seeker trouvé
    res.status(200).json({ jobSeeker });
  } catch (error) {
    console.error('Error fetching job seeker:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {
  getUserJobSeekerProfile,
   registerUserjobseeker,
   getUserJobSeekers,
   getUserJobSeekerById,
 };
 