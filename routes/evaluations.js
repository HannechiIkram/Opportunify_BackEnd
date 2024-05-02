// routes/evaluations.js

const express = require('express');
const router = express.Router();
const Evaluation = require('../models/evaluation');

// GET all evaluations
router.get('/', async (req, res) => {
  try {
    const evaluations = await Evaluation.find();
    res.json(evaluations);
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET a single evaluation by ID
router.get('/quiz/:id', async (req, res) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id);
    if (!evaluation) {
      return res.status(404).json({ error: 'Evaluation not found' });
    }
    res.json(evaluation);
  } catch (error) {
    console.error('Error fetching evaluation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST create a new evaluation
router.post('/add', async (req, res) => {
  try {
    const { title, description, questions, category ,difficulty,keywords } = req.body;
    const newEvaluation = new Evaluation({ title, description, questions, category ,difficulty,keywords });
    await newEvaluation.save();
    res.status(201).json(newEvaluation);
  } catch (error) {
    console.error('Error creating evaluation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT update an existing evaluation
router.put('/update/:id', async (req, res) => {
  try {
    const { title, description, questions, category ,difficulty,keywords} = req.body;
    const updatedEvaluation = await Evaluation.findByIdAndUpdate(req.params.id, { title, description, questions, category ,difficulty,keywords  }, { new: true });
    if (!updatedEvaluation) {
      return res.status(404).json({ error: 'Evaluation not found' });
    }
    res.json(updatedEvaluation);
  } catch (error) {
    console.error('Error updating evaluation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE delete an existing evaluation
router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedEvaluation = await Evaluation.findByIdAndDelete(req.params.id);
    if (!deletedEvaluation) {
      return res.status(404).json({ error: 'Evaluation not found' });
    }
    res.json({ message: 'Evaluation deleted successfully' });
  } catch (error) {
    console.error('Error deleting evaluation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// POST submit answers for a quiz
router.post('/quiz/:id/submit', async (req, res) => {
    try {
      const { answers } = req.body;
      const quizId = req.params.id;
      
      // Logic to validate answers and calculate score
      // For simplicity, let's assume the backend just echoes back the answers received
      res.json({ answers, quizId });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.get('/search', async (req, res) => {
    try {
      const { category, difficulty, keywords } = req.query;
  
      // Construire les filtres de recherche
      const filters = {};
      if (category) {
        filters.category = category;
      }
      if (difficulty) {
        filters.difficulty = difficulty;
      }
      if (keywords) {
        filters.keywords = { $in: keywords.split(',') };
      }
  
      // Effectuer la recherche avec les filtres
      const evaluations = await Evaluation.find(filters);
  
      res.json(evaluations);
    } catch (error) {
      console.error('Error searching evaluations:', error);
      res.status(500).json({ error: 'Error searching evaluations' });
    }
  });

module.exports = router;