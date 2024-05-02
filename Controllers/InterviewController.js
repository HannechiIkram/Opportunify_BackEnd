/*const ProfileJobSeeker = require("../models/Profile_jobseeker");
const Application = require("../models/application"); 


async function getProfileJobSeekerByApplicationId(applicationId) {
    try {
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
      return profileJobSeeker._id;
    } catch (error) {
      throw error;
    }
  }


  module.exports = { getProfileJobSeekerByApplicationId };*/