const express = require("express");
const router = express.Router();
const authMiddleware = require('../midill/authMiddleware');
const accessControl = require('../midill/accescontrol');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const {addevent,geteventbyid,getAllevents}= require("../Controllers/eventController");

const cors = require('cors'); 
const event = require ("../models/event");

router.use(
    cors({
      credentials: true,
      origin: 'http://localhost:5173'
    })
);

////router.post('/addevent',authMiddleware,addevent);
router.post('/addevent',addevent);
router.get('/getallevents', getAllevents);
router.get("/geteventbyid/:id",geteventbyid);

// [UPDATE] par titre
router.put("/updateevent/:titre", async function (req, res) {
    try {
      const updatedEvent = await event.findOneAndUpdate(
        { title: req.params.titre }, 
        req.body, 
        { new: true }
      );
      if (!updatedEvent) {
        return res.status(404).json({ error: 'Event not found' });
      }
      res.status(200).json(updatedEvent);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  ///update par id

router.put("/updateevent/:id", async function (req, res) {
    try {
      const updatedEvent = await event.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedEvent) {
        return res.status(404).json({ error: 'event not found' });
      }
      res.status(200).json(updatedEvent);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
///delete event by id
router.delete("/deleteevent/:id", async function (req, res) {
    try {
      const deletdedEvent = await event.findOneAndDelete({ _id: req.params.id });
      if (!deletdedEvent) {
        return res.status(404).json({ error: 'Event not found' });
      }
      res.status(200).json({ message: 'event deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


module.exports = router;
