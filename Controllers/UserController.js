const UserModel = require('../models/user'); // Adjust the path accordingly

const test =(req, res) =>{ 
    res.json('test is working')
}

const registerUser = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      if (!name) {
        return res.json({
          error: 'name is required'
        });
      }
  
      if (!password || password.length < 6) {
        return res.json({
          error: 'password is required'
        });
      }
  
      const exist = await UserModel.findOne({ email });
  
      if (exist) {
        return res.json({
          error: 'email is already taken'
        });
      }
  
      const newUser = await UserModel.create({
        name,
        email,
        password
      });
  
      return res.json(newUser);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  module.exports = {
    test,
    registerUser
  };