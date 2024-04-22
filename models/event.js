// Import Mongoose
const mongoose = require('mongoose');

// Define the event schema
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  organizer: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  attendees:[String]
  ,/*
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],*/
  registrationDeadline: {
    type: Date
  },
  capacity: {
    type: Number,
    required: true
  },
  ticket_cost: {
    type: Number
  },
  contactInformation: {
    type: String
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'past'],
    default: 'upcoming'
  },
  tags: [String]
});
const Event = mongoose.model('Event', eventSchema);
module.exports = Event;

/*const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  creationDate: {
    type: Date,
    default: Date.now
  },
  deadline: {
    type: Date,
    required: true
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;*/
