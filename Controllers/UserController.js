const UserModel = require('../models/user-jobseeker'); // Adjust the path accordingly
const { comparePassword, hashPassword } = require('../helpers/auth');
const jwt = require('jsonwebtoken');

// Sign up endpoint (register du job seeker)
const registerUserjobseeker = async (req, res) => {
  try {
    const { name,lastname,birthdate, email,phone,adress, password, } = req.body;

    if (!name || !lastname||!birthdate||!email ||!phone||!adress ||!password) {
      return res.status(400).json({ error: 'All the fields are required' });
    }
/*//// controle de saisie à refaire apres celui du frontend (meme controle)
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
*/
    const exist = await UserModel.findOne({ email });
    if (exist) {
      return res.status(400).json({ error: 'Email is already taken' });
    }

    const hashedPassword = await hashPassword(password);
    const newUserjobseeker = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      lastname,
      birthdate,
      phone,
      adress,
      password

    });

    return res.status(201).json(newUserjobseeker);
  } catch (error) {
    console.error(error);
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
 
  registerUserjobseeker,
  loginUser
};
