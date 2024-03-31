
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOptionIndex: { type: Number, required: true },
});

const evaluationSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  questions: [questionSchema],
});

module.exports = mongoose.model('Evaluation', evaluationSchema);
