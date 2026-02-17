const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  teamId: {
    type: String,
    required: true,
    unique: true,
    ref: 'Team'
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date,
    default: null
  },
  completedRounds: {
    type: Number,
    default: 0
  },
  // Lock status for each round
  locks: {
    redGreen: {
      type: String,
      enum: ['locked', 'unlocked', 'permanently_locked'],
      default: 'locked'
    },
    circle: {
      type: String,
      enum: ['locked', 'unlocked', 'permanently_locked'],
      default: 'locked'
    },
    triangle: {
      type: String,
      enum: ['locked', 'unlocked', 'permanently_locked'],
      default: 'locked'
    },
    square: {
      type: String,
      enum: ['locked', 'unlocked', 'permanently_locked'],
      default: 'locked'
    },
    umbrella: {
      type: String,
      enum: ['locked', 'unlocked', 'permanently_locked'],
      default: 'locked'
    }
  },
  // Anti-refresh: store assigned question IDs per round
  currentQuestions: {
    redGreen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      default: null
    },
    circle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      default: null
    },
    triangle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      default: null
    },
    square: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      default: null
    },
    // Umbrella stores 3 question IDs
    umbrella: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    }]
  },
  // For triangle round - store selected language
  selectedLanguage: {
    type: String,
    enum: ['python', 'c', null],
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Progress', ProgressSchema);
