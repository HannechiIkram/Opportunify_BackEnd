const UserModel = require('../models/user'); 
const UserjobseekerModel = require('../models/user-jobseeker'); 

const { comparePassword, hashPassword } = require('../helpers/auth');
const jwt = require('jsonwebtoken');


//ajouter un user quelconque( pour l'admin peut etre)
const registerUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate input
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already taken' });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = await UserModel.create({
      email,
      password: hashedPassword,
      role,
    });

    // Return response
    return res.status(201).json({
      id: newUser._id,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    console.error('Error during user registration:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};





// Login endpoint
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Passwords don\'t match' });
    }

    jwt.sign({ email: user.email, id: user._id, name: user.name }, process.env.JWT_SECRET, {}, (err, token) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error signing JWT' });
      }
      res.cookie('token', token).json(user);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
 registerUser,
  loginUser
};
