const express = require("express");
const User = require ("../models/user")
const job_offer = require("../models/job_offer")


const UserCompanyModel = require('../models/user-company');

async function getall(req, res) {
  try {
    // Récupérer l'utilisateur à partir des données attachées par le middleware authMiddleware
    const user = req.user;

    // Vérifier si l'utilisateur est connecté en vérifiant s'il existe dans la demande
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized - User not logged in' });
    }

    // Si l'utilisateur est connecté, vous pouvez exécuter la logique pour récupérer tous les utilisateurs
    const data = await job_offer.find();
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
///samar
/// liste des offres pour homepage (maghir login)
async function getoffershomepage(req, res) {
  try {
    const data = await job_offer.find();
    res.send(data);
    }    
   catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
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

// Créer une nouvelle offre
async function add(req, res) {
  try {
    const companyId = req.user.id; // ID de l'utilisateur connecté

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

    if (!deadline){
      return res.status(400).json({ error: "deadline cannot be empty" });

    }
 // Validate title length
 if (title.length < 5) {
  return res.status(400).json({ error: "Title must be at least 5 characters long" });
}
// Validate title
if (!/^[a-zA-Z]+$/.test(title)) {
  return res.status(400).json({ error: "Title must contain only alphabetical characters" });
}

// Validate responsibilities
if (!/^[a-zA-Z]+$/.test(responsibilities)) {
  return res.status(400).json({ error: "responsibilities must contain only alphabetical characters" });
}
// Validate job location (lieu) length
if (lieu.length < 5) {
  return res.status(400).json({ error: "Job location must be at least 5 characters long" });
}
// Validate description length
if (description.length < 10) {
  return res.status(400).json({ error: "Description must be at least 10 characters long" });
}
// Validate salary informations
const salaryRegex = /^\d{3,}\s*(\$|DT|€)$/; // Au moins 3 chiffres suivis d'un symbole ($, DT ou €)
if (!salaryRegex.test(salary_informations)) {
  return res.status(400).json({ error: "Salary information must contain at least 3 numbers followed by a currency symbol ($, DT or €)" });
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
      company: companyId // Associé à l'utilisateur de l'entreprise connecté
    });

    await newJobOffer.save();
    res.status(201).json(newJobOffer);
  } catch (error) {
    res.status(400).json({ error: error.toString() });
  }
}


module.exports = { getall, getbyid , add ,getoffershomepage};
