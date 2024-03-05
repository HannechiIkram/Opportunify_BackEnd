const UserModel = require('../models/user'); 

const { comparePassword, hashPassword } = require('../helpers/auth');


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




module.exports = {
 registerUser,
  
};
