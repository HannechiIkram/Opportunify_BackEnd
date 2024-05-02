const mongoose = require('mongoose');
const { rolePermissions } = require('../helpers/permissions');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  image: {
    type: String, // Utilisez un chemin ou une URL valide
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /\S+@\S+\.\S+/.test(v); // Validation simple des emails
      },
      message: (props) => `${props.value} n'est pas un email valide!`,
    },
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['job_seeker', 'company', 'admin'],
  },
  permissions: {
    type: Object,
    default: {},
    select: false,
  },
  phone: {
    type: Number,
    validate: {
      validator: function (v) {
        return /^\d+$/.test(v); // Vérifie que c'est un nombre
      },
      message: (props) => `${props.value} n'est pas un numéro de téléphone valide!`,
    },
  },
  description: {
    type: String,
    trim: true,
  },
  accepted: {
    type: Boolean,
    default: true,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  resetToken: {
    type: String,
  },
  resetTokenExpires: {
    type: Date,
  },
  socialMedia: {
    facebook: {
      type: String,
      trim: true,
    },
    twitter: {
      type: String,
      trim: true,
    },
    linkedin: {
      type: String,
      trim: true,
    },
  },
});

// Ajouter des permissions basées sur le rôle de l'utilisateur
userSchema.pre('save', function (next) {
  const role = this.role;
  this.permissions = rolePermissions[role] || {};
  next();
});

module.exports = mongoose.model('User', userSchema);
