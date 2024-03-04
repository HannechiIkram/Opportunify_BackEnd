const UserModel = require('../models/user'); 
const UserJobSeekerModel = require('../models/user-jobseeker'); 
const { comparePassword, hashPassword } = require('../helpers/auth');
// Sign up endpoint (register du job seeker)
const registerUserjobseeker = async (req,res) => {
  try {
    const { name,lastname,birthdate, email,phone,address, password,role_jobseeker } = req.body;

    if (!name || !lastname||!birthdate||!email ||!phone||!address ||!password ||!role_jobseeker) {
      return res.status(400).json({ error: 'All the fields are required' });
    }
/*//// controle de saisie à refaire apres celui du frontend (meme controle)
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
*/

// Check if user already exists
const existingUser = await UserModel.findOne({ email });
if (existingUser) {
  return res.status(400).json({ error: 'Email is already taken' });
}
// crypter le mdp
    const hashedPassword = await hashPassword(password);

    //ajouter el user if role mteou job_seeker f table mtaa jobseeker
   
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

// Create the UserJobSeeker f table mtaa jobseeker
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

    return res.status(201).json({msg:"user added successfully",newUser,newUserJobSeeker});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
module.exports = {
  
   registerUserjobseeker
   
 };
 