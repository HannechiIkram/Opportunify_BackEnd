const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Référence au modèle User
    required: true,
  },
  message: {
    type: String, // Doit être une chaîne de caractères
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Assure une valeur par défaut
  },
  isRead: {
    type: Boolean,
    default: false, // Valeur par défaut
  },
});

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;
