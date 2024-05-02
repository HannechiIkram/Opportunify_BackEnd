const express = require("express");
const router = express.Router();

const Notification = require("../models/Notifications");

const Notifications = require("../models/Notifications");

const authMiddleware = require("../midill/authMiddleware");


// Route pour récupérer toutes les notifications de l'utilisateur
router.get('/notifications', authMiddleware, async (req, res) => {
    try {
      const jobSeekerId = req.user.id;
      const notifications = await Notifications.find({ job_seeker: jobSeekerId }).populate('job_offer', 'title');
      console.log(notifications);
      res.status(200).json(notifications);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const notificationId = req.params.id;
        const deletedNotification = await Notifications.findByIdAndDelete(notificationId);
        if (!deletedNotification) {
            // La notification n'a pas été trouvée
            return res.status(404).json({ error: 'Notification not found' });
        }
        res.sendStatus(200); // Réponse OK
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

  module.exports = router;
