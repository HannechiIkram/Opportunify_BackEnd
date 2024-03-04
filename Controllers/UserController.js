const UserModel = require('../models/user');
const { comparePassword, hashPassword } = require('../helpers/auth');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');  // Import nodemailer here

// Import the transporter configuration (make sure the path is correct)
const transporter = require('../nodemailer-config');
// Test endpoint
const test = (req, res) => {
  res.json('test is working');
};const registerUser = async (req, res) => {
  try {
    const { name, email, password, matriculeFiscale, description, socialMedia, address, phoneNumber, domainOfActivity } = req.body;

    // Vérification de la présence des champs obligatoires
    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Validation de la longueur du mot de passe
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Vérification si l'email est déjà pris
    const exist = await UserModel.findOne({ email });
    if (exist) {
      return res.status(400).json({ error: 'Email is already taken' });
    }

    // Validation du numéro de téléphone
    if (!/^\d{1,12}$/.test(phoneNumber)) {
      return res.status(400).json({ error: 'Phone number should contain only digits and not exceed 12 characters' });
    }

    // Validation du domaine d'activité
    if (!/^[a-zA-Z]+$/.test(domainOfActivity)) {
      return res.status(400).json({ error: 'Domain of activity should contain only letters' });
    }

    // Validation des liens des réseaux sociaux
    const socialMediaValidation = validateSocialMediaLinks(socialMedia);
    if (socialMediaValidation.error) {
      return res.status(400).json({ error: socialMediaValidation.error });
    }

   // Validation de la description
if (!/^[a-zA-Z\s\n]+$/.test(description)) {
  return res.status(400).json({ error: 'Description should contain only letters, spaces, and paragraphs' });
}

    // Création d'un nouveau modèle d'utilisateur avec les nouveaux champs
    const hashedPassword = await hashPassword(password);
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      matriculeFiscale,
      description,
      socialMedia,
      address,
      phoneNumber,
      domainOfActivity
    });

    // Retourner la réponse avec le nouvel utilisateur créé
    return res.status(201).json(newUser);
  } catch (error) {
    // Gestion des erreurs
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to validate social media links
const validateSocialMediaLinks = (socialMedia) => {
  for (const key in socialMedia) {
    const link = socialMedia[key];
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

    if (!urlRegex.test(link)) {
      return { error: `${key} should be a valid URL` };
    }
  }

  return { valid: true };
};const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user based on the provided email
    const user = await UserModel.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Compare the provided password with the stored hashed password
    const match = await comparePassword(password, user.password);

    // Check if the passwords match
    if (!match) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    // Generate access token
    const accessToken = jwt.sign(
      { email: user.email, id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1m' } // Adjust the expiration time as needed
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { email: user.email, id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' } // Adjust the expiration time as needed
    );

    // Set both tokens as HTTP-only cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true, // other cookie options as needed
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, // other cookie options as needed
    });

    // Return the access token in the response
    res.status(200).json({ accessToken, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



// UserController.js
const refreshAccessToken = (req, res) => {
  try {
    // Get the refresh token from the HTTP-only cookie
    const refreshToken = req.cookies.refreshToken;
    console.log('Received Refresh Token:', refreshToken);

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    console.log('Decoded Refresh Token:', decoded);

    // Generate a new access token
    const accessToken = jwt.sign(
      { email: decoded.email, id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // Adjust the expiration time as needed
    );

    // Return the new access token
    res.status(200).json({ accessToken });
  } catch (error) {
    console.error('Refresh Token Error:', error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Utilisateur non trouvé' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');

    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 3600000; // 1 heure d'expiration

    await user.save();

    const mailOptions = {
      from: 'hannechiikram49@gmail.com',
      to: email,
      subject: 'Réinitialisation de mot de passe',
      text: `Cliquez sur le lien suivant pour réinitialiser votre mot de passe : http://votre_application.com/reset-password?token=${resetToken}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Erreur d\'envoi de l\'e-mail :', error);
        return res.status(500).json({ error: 'Erreur interne du serveur' });
      }
      console.log('E-mail envoyé :', info.response);
      res.status(200).json({ message: 'Lien de réinitialisation du mot de passe envoyé à votre e-mail' });
    });
  } catch (error) {
    console.error('Erreur de mot de passe oublié :', error);
    return res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

const resetPassword = async (req, res) => {
  // ... (Votre code pour la fonction de réinitialisation du mot de passe)
};


module.exports = {
  test,
  registerUser,
  loginUser,
  refreshAccessToken,
  forgotPassword, 
  resetPassword

};
