const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  // Type identifies which round this question belongs to
  type: {
    type: String,
    required: true,
    enum: ['redGreen', 'circle', 'triangle_python', 'triangle_c', 'square', 'mcq']
  },
  question: {
    type: String,
    required: true
  },
  // For MCQ only
  options: {
    type: [String],
    default: undefined
  },
  // For Square (Cows & Bulls) round - Cloudinary image URL
  imageUrl: {
    type: String,
    default: undefined
  },
  // Correct answer - NEVER sent to frontend
  correctAnswer: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);
