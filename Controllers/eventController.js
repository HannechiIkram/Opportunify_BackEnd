const event = require("../models/event")
const user = require ("../models/user")

async function addevent(req, res) {
    try {
     // const userId = req.user._id; // ID de l'utilisateur connecté
  
      // Destructure the required fields from req.body
      const {
        title,
         description,
          startDate,
           endDate, 
          location, 
          organizer, 
          type, 
          /*attendees,*/
           registrationDeadline, 
          capacity, 
          ticket_cost, 
           contactInformation, 
           status, 
          tags

      } = req.body;
  
      // Check if any required field is missing
  if (!title || !description || !startDate || !ticket_cost ||
!tags||/*!attendees|| */
    !endDate || !location || !organizer ||
     !type || !capacity || !contactInformation || !status) {
    // If any required field is missing, return a 400 Bad Request response
    return res.status(400).json({ error: "Missing required fields" });
  }

  
      const newevent = new event({
        title,
        description,
         startDate, endDate, 
         location, organizer, 
         type, /*attendees,*/ registrationDeadline, 
         capacity, ticket_cost, 
          contactInformation, status, 
         tags,
       //user: userId // Associé à l'utilisateur de l'entreprise connecté
      });
  
      await newevent.save();
      res.status(201).json(newevent);
    } catch (error) {
      res.status(400).json({ error: error.toString() });
    }
  }

  //la recherche par id

async function geteventbyid(req, res) {
    try {
  
      const data = await event.findById(req.params.id);
      res.send(data);
    } catch (err) {
      res.send(err);
    }
  } 


  async function getAllevents(req,res) {
    try {
      // Récupérer l'utilisateur à partir des données attachées par le middleware authMiddleware
      /*const user = req.user;
  
      // Vérifier si l'utilisateur est connecté en vérifiant s'il existe dans la demande
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized - User not logged in' });
      }*/
  
      // Si l'utilisateur est connecté, vous pouvez exécuter la logique pour récupérer tous les utilisateurs
      const data = await event.find();
      res.send(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  module.exports={addevent,geteventbyid,getAllevents};
