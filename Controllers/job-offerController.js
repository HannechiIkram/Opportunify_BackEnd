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
async function add(req, res) {
  try {
    const newJobOffer = new job_offer(req.body);
    
    await newJobOffer.save();
    res.status(200).send("Job offer added successfully");
  } catch (err) {
    res.status(400).send({ error: err.toString() });



    
  }
}
module.exports = { getall, getbyid , add };
