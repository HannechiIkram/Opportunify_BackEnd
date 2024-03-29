const express = require("express");

const job_offer = require("../models/job_offer");

// la rcherche de tous les utilisateurs
async function getall(req, res) {
  try {
   
    const data = await job_offer.find();
    res.send(data);
  } catch (err) {
    res.send(err);
  }
}

//la recherche par id

async function getbyid(req, res) {
  try {

    const data = await job_offer.findById(req.params.id);
    res.send(data);
  } catch (err) {
    res.send(err);
  }
}  




// l'ajout d'un utilisateur
/*async function add(req, res, next) {
  try {
  
    const job_offer = new job_offer(req.body);
    await job_offer.save();
    res.status(200).send("add success");
  } catch (err) {
    res.status(400).send({ error: error.toString() });
  }
}
*/
// l'ajout d'un utilisateur
/*
async function add(req, res) {
  try {
    const userId = req.user._id; // ID de l'utilisateur connecté

    const newJobOffer = new job_offer(req.body);
    
    await newJobOffer.save();
    res.status(200).send("Job offer added successfully");
  } catch (err) {
    res.status(400).send({ error: err.toString() });



    
  }
}*/
// Créer une nouvelle offre
async function add(req, res) {
  try {
      const companyId = req.user._id; // ID de l'utilisateur de l'entreprise connecté

      // Destructure the required fields from req.body
      const {
          title,
          description,
          qualifications,
          responsibilities,
          lieu,
          langue,
          workplace_type,
          field,
          salary_informations,
          deadline
      } = req.body;

      // Validate if all required fields are present in req.body
      if (!title || !description || !qualifications || !responsibilities || !lieu || !langue || !workplace_type || !field || !salary_informations || !deadline) {
          // If any required field is missing, return a 400 Bad Request response
          return res.status(400).json({ error: "Missing required fields" });
      }

      const newJobOffer = new job_offer({
          title,
          description,
          qualifications,
          responsibilities,
          lieu,
          langue,
          workplace_type,
          field,
          salary_informations,
          deadline,
          company: companyId // Associé à l'ID de l'utilisateur de l'entreprise connecté
      });

      await newJobOffer.save();
      res.status(201).json(newJobOffer);
  } catch (error) {
      res.status(400).json({ error: error.toString() });
  }
}

// Récupérer les offres d'un utilisateur de l'entreprise spécifique
exports.getOffersByCompany = async (req, res, next) => {
  try {
    const userId = req.user._id; // ID de l'utilisateur connecté

    const offers = await Offer.find({ company: userId });
    res.status(200).json(offers);
  } catch (error) {
    next(error);
  }
};

module.exports = { getall, getbyid , add };
