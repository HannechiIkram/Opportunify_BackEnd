// Express.js routes for managing interview events

const express = require('express');
const router = express.Router();
const InterviewEvent = require('../models/InterviewEvent');
const ProfileJobSeeker = require("../models/Profile_jobseeker");
const Application = require("../models/application"); 
// Route to create a new interview event
router.post('/interview-event', async (req, res) => {
    try {
        const interviewEvent = new InterviewEvent(req.body);
        await interviewEvent.save();
        res.status(201).send(interviewEvent);
    } catch (error) {
        console.error('Error creating interview event:', error);
        res.status(500).send('Failed to create interview event');
    }
});

// Route to get all interview events
router.get('/interview-events', async (req, res) => {
    try {
        const interviewEvents = await InterviewEvent.find();
        res.send(interviewEvents);
    } catch (error) {
        console.error('Error fetching interview events:', error);
        res.status(500).send('Failed to fetch interview events');
    }
});

// Route to get profile job seeker by application ID
router.get('/profile-jobseeker/:applicationId', async (req, res) => {
    try {
        const { applicationId } = req.params;

        // Find the application by its ID
        const application = await Application.findById(applicationId);
        
        if (!application) {
            throw new Error('Application not found');
        }
        
        // Extract the email from the application
        const email = application.email;
        
        // Find the profile job seeker by the email
        const profileJobSeeker = await ProfileJobSeeker.findOne({ email });
        
        if (!profileJobSeeker) {
            throw new Error('Profile job seeker not found');
        }
        
        // Return the profile job seeker
        res.send(profileJobSeeker._id);
    } catch (error) {
        console.error('Error fetching profile job seeker:', error);
        res.status(500).send('Failed to fetch profile job seeker');
    }
});

router.post('/interview-event/:applicationId', async (req, res) => {
    try {
        const { applicationId } = req.params;
        
        // Find the application by its ID
        const application = await Application.findById(applicationId);
      
        if (!application) {
            throw new Error('Application not found');
        }
      
        // Extract the email from the application
        const email = application.email;
      
        // Find the profile job seeker by the email
        const profileJobSeeker = await ProfileJobSeeker.findOne({ email });
      
        if (!profileJobSeeker) {
            throw new Error('Profile job seeker not found');
        }
      
        // Extract the profile job seeker's ID
        const profileJobSeekerId = profileJobSeeker._id;
        
        // Add profileJobSeekerId to the request body
        req.body.profileJSid = profileJobSeekerId;
        
        // Create the interview event with the updated request body
        const interviewEvent = new InterviewEvent(req.body);
        await interviewEvent.save();
        
        // Send the created interview event as the response
        res.status(201).send(interviewEvent);
    } catch (error) {
        console.error('Error creating interview event:', error);
        res.status(500).send('Failed to create interview event');
    }
});

/////////////////////////////////////////////////////////

router.post('/interview-event/:applicationId/:pid', async (req, res) => {
    try {
        const { applicationId, pid } = req.params;
        
        // Find the application by its ID
        const application = await Application.findById(applicationId);
      
        if (!application) {
            throw new Error('Application not found');
        }
      
        // Extract the email from the application
        const email = application.email;
      
        // Find the profile job seeker by the email
        const profileJobSeeker = await ProfileJobSeeker.findOne({ email });
      
        if (!profileJobSeeker) {
            throw new Error('Profile job seeker not found');
        }
      
        // Extract the profile job seeker's ID
        const profileJobSeekerId = profileJobSeeker._id;
        
        // Add profileJobSeekerId and pid to the request body
        req.body.profileJSid = profileJobSeekerId;
        req.body.profileCid = pid;
        
        // Create the interview event with the updated request body
        const interviewEvent = new InterviewEvent(req.body);
        await interviewEvent.save();
        
        // Send the created interview event as the response
        res.status(201).send(interviewEvent);
    } catch (error) {
        console.error('Error creating interview event:', error);
        res.status(500).send('Failed to create interview event');
    }
});

// Route to get all interview events for a specific profileCid
router.get('/interview-events/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        const interviewEvents = await InterviewEvent.find({ profileCid: pid });
        res.send(interviewEvents);
    } catch (error) {
        console.error('Error fetching interview events:', error);
        res.status(500).send('Failed to fetch interview events');
    }
});


// Route to get all interview events for a specific profilejobseeker
router.get('/interview-eventsJS/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const interviewEvents = await InterviewEvent.find({ profileJSid: id });
        res.send(interviewEvents);
    } catch (error) {
        console.error('Error fetching interview events:', error);
        res.status(500).send('Failed to fetch interview events');
    }
});
// Route to delete one interview event by its ID
router.delete('/interview-event/:interviewEventId', async (req, res) => {
    const { interviewEventId } = req.params;

    try {
        // Find the interview event by its ID and delete it
        const deletedEvent = await InterviewEvent.findByIdAndDelete(interviewEventId);
        
        if (!deletedEvent) {
            // If no event found, send a 404 response
            return res.status(404).send('Interview event not found');
        }

        // Send a success message
        res.status(200).send('Interview event deleted successfully');
    } catch (error) {
        // Handle errors
        console.error('Error deleting interview event:', error);
        res.status(500).send('Failed to delete interview event');
    }
});


// Other CRUD routes for updating and deleting interview events

module.exports = router;
