const Question = require('../models/Question');
const Progress = require('../models/Progress');

/**
 * Helper: Get progress for a team
 */
const getProgress = async (teamId) => {
  return await Progress.findOne({ teamId });
};

/**
 * Helper: Pick random document from array
 */
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ======================
// GET /api/game/status
// Returns current progress/locks for team
// ======================
const getStatus = async (req, res) => {
  try {
    const progress = await getProgress(req.team.teamId);
    if (!progress) return res.status(404).json({ message: 'Progress not found' });

    res.json({
      locks: progress.locks,
      completedRounds: progress.completedRounds,
      startTime: progress.startTime,
      endTime: progress.endTime
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching status', error: error.message });
  }
};

// =============================
// ROUND 1 - RED LIGHT GREEN LIGHT
// GET /api/game/redgreen → just signals the page is open
// POST /api/game/redgreen/submit → checks the hardcoded password
// =============================
const getRedGreen = async (req, res) => {
  try {
    const progress = await getProgress(req.team.teamId);
    if (!progress) return res.status(404).json({ message: 'Progress not found' });

    if (progress.locks.redGreen === 'permanently_locked') {
      return res.status(403).json({ message: 'Round permanently locked', locked: true });
    }
    if (progress.locks.redGreen === 'unlocked') {
      return res.json({ status: 'unlocked' });
    }

    // Return minimal info - no correct answer exposed
    res.json({ round: 'redGreen', message: 'Enter the secret code' });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

const submitRedGreen = async (req, res) => {
  const { answer } = req.body;
  try {
    const progress = await getProgress(req.team.teamId);
    if (!progress) return res.status(404).json({ message: 'Progress not found' });

    if (progress.locks.redGreen === 'permanently_locked') {
      return res.status(403).json({ message: 'Round permanently locked' });
    }
    if (progress.locks.redGreen === 'unlocked') {
      return res.json({ message: 'Already unlocked', correct: true });
    }

    // Compare with secret env variable - never exposed to frontend
    const correct = answer === (process.env.REDGREEN_PASSWORD || 'cachemeifyoucan');

    if (correct) {
      progress.locks.redGreen = 'unlocked';
      progress.completedRounds += 1;
    } else {
      progress.locks.redGreen = 'permanently_locked';
    }

    await progress.save();
    res.json({ correct, locks: progress.locks, completedRounds: progress.completedRounds });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

// =============================
// ROUND 2 - CIRCLE (Logical)
// GET /api/game/circle → returns question (same on refresh)
// POST /api/game/circle/submit → validates answer
// =============================
const getCircle = async (req, res) => {
  try {
    const progress = await getProgress(req.team.teamId);
    if (!progress) return res.status(404).json({ message: 'Progress not found' });

    if (progress.locks.circle === 'permanently_locked') {
      return res.status(403).json({ message: 'Round permanently locked', locked: true });
    }
    if (progress.locks.circle === 'unlocked') {
      return res.json({ status: 'unlocked' });
    }

    let question;

    // Anti-refresh: return same question if already assigned
    if (progress.currentQuestions.circle) {
      question = await Question.findById(progress.currentQuestions.circle).select('-correctAnswer');
    } else {
      const allQuestions = await Question.find({ type: 'circle' });
      if (!allQuestions.length) return res.status(404).json({ message: 'No questions found' });

      const selected = pickRandom(allQuestions);
      progress.currentQuestions.circle = selected._id;
      await progress.save();
      question = await Question.findById(selected._id).select('-correctAnswer');
    }

    res.json({ question });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

const submitCircle = async (req, res) => {
  const { answer } = req.body;
  try {
    const progress = await getProgress(req.team.teamId);
    if (!progress) return res.status(404).json({ message: 'Progress not found' });

    if (progress.locks.circle === 'permanently_locked') {
      return res.status(403).json({ message: 'Round permanently locked' });
    }
    if (progress.locks.circle === 'unlocked') {
      return res.json({ message: 'Already unlocked', correct: true });
    }

    if (!progress.currentQuestions.circle) {
      return res.status(400).json({ message: 'No question assigned, fetch question first' });
    }

    // Fetch correct answer from stored question ID
    const question = await Question.findById(progress.currentQuestions.circle);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    const correct = answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();

    if (correct) {
      progress.locks.circle = 'unlocked';
      progress.completedRounds += 1;
    } else {
      progress.locks.circle = 'permanently_locked';
    }

    await progress.save();
    res.json({ correct, locks: progress.locks, completedRounds: progress.completedRounds });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

// =============================
// ROUND 3 - TRIANGLE (Code Output)
// GET /api/game/triangle → takes language param, returns question
// POST /api/game/triangle/submit → validates answer
// =============================
const getTriangle = async (req, res) => {
  const { language } = req.query; // 'python' or 'c'

  if (!language || !['python', 'c'].includes(language)) {
    return res.status(400).json({ message: 'Invalid language. Choose python or c' });
  }

  try {
    const progress = await getProgress(req.team.teamId);
    if (!progress) return res.status(404).json({ message: 'Progress not found' });

    if (progress.locks.triangle === 'permanently_locked') {
      return res.status(403).json({ message: 'Round permanently locked', locked: true });
    }
    if (progress.locks.triangle === 'unlocked') {
      return res.json({ status: 'unlocked' });
    }

    let question;
    const qType = language === 'python' ? 'triangle_python' : 'triangle_c';

    // Anti-refresh: return same question if already assigned
    if (progress.currentQuestions.triangle) {
      question = await Question.findById(progress.currentQuestions.triangle).select('-correctAnswer');
    } else {
      const allQuestions = await Question.find({ type: qType });
      if (!allQuestions.length) return res.status(404).json({ message: 'No questions found' });

      const selected = pickRandom(allQuestions);
      progress.currentQuestions.triangle = selected._id;
      progress.selectedLanguage = language;
      await progress.save();
      question = await Question.findById(selected._id).select('-correctAnswer');
    }

    res.json({ question, language: progress.selectedLanguage || language });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

const submitTriangle = async (req, res) => {
  const { answer } = req.body;
  try {
    const progress = await getProgress(req.team.teamId);
    if (!progress) return res.status(404).json({ message: 'Progress not found' });

    if (progress.locks.triangle === 'permanently_locked') {
      return res.status(403).json({ message: 'Round permanently locked' });
    }
    if (progress.locks.triangle === 'unlocked') {
      return res.json({ message: 'Already unlocked', correct: true });
    }

    if (!progress.currentQuestions.triangle) {
      return res.status(400).json({ message: 'No question assigned, fetch question first' });
    }

    const question = await Question.findById(progress.currentQuestions.triangle);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    const correct = answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();

    if (correct) {
      progress.locks.triangle = 'unlocked';
      progress.completedRounds += 1;
    } else {
      progress.locks.triangle = 'permanently_locked';
    }

    await progress.save();
    res.json({ correct, locks: progress.locks, completedRounds: progress.completedRounds });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

// =============================
// ROUND 4 - SQUARE (Cows & Bulls Image)
// GET /api/game/square → returns imageUrl (same on refresh)
// POST /api/game/square/submit → validates 4-digit answer
// =============================
const getSquare = async (req, res) => {
  try {
    const progress = await getProgress(req.team.teamId);
    if (!progress) return res.status(404).json({ message: 'Progress not found' });

    if (progress.locks.square === 'permanently_locked') {
      return res.status(403).json({ message: 'Round permanently locked', locked: true });
    }
    if (progress.locks.square === 'unlocked') {
      return res.json({ status: 'unlocked' });
    }

    let question;

    // Anti-refresh: return same question
    if (progress.currentQuestions.square) {
      question = await Question.findById(progress.currentQuestions.square).select('-correctAnswer');
    } else {
      const allQuestions = await Question.find({ type: 'square' });
      if (!allQuestions.length) return res.status(404).json({ message: 'No questions found' });

      const selected = pickRandom(allQuestions);
      progress.currentQuestions.square = selected._id;
      await progress.save();
      question = await Question.findById(selected._id).select('-correctAnswer');
    }

    // Return only imageUrl and question text - never correctAnswer
    res.json({
      questionId: question._id,
      question: question.question,
      imageUrl: question.imageUrl
    });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

const submitSquare = async (req, res) => {
  const { answer } = req.body;
  try {
    const progress = await getProgress(req.team.teamId);
    if (!progress) return res.status(404).json({ message: 'Progress not found' });

    if (progress.locks.square === 'permanently_locked') {
      return res.status(403).json({ message: 'Round permanently locked' });
    }
    if (progress.locks.square === 'unlocked') {
      return res.json({ message: 'Already unlocked', correct: true });
    }

    if (!progress.currentQuestions.square) {
      return res.status(400).json({ message: 'No question assigned, fetch question first' });
    }

    const question = await Question.findById(progress.currentQuestions.square);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    const correct = answer.trim() === question.correctAnswer.trim();

    if (correct) {
      progress.locks.square = 'unlocked';
      progress.completedRounds += 1;
    } else {
      progress.locks.square = 'permanently_locked';
    }

    await progress.save();
    res.json({ correct, locks: progress.locks, completedRounds: progress.completedRounds });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

// =============================
// ROUND 5 - UMBRELLA (3 MCQs)
// GET /api/game/umbrella → returns 3 questions (same on refresh)
// POST /api/game/umbrella/submit → validates all 3 answers
// =============================
const getUmbrella = async (req, res) => {
  try {
    const progress = await getProgress(req.team.teamId);
    if (!progress) return res.status(404).json({ message: 'Progress not found' });

    if (progress.locks.umbrella === 'permanently_locked') {
      return res.status(403).json({ message: 'Round permanently locked', locked: true });
    }
    if (progress.locks.umbrella === 'unlocked') {
      return res.json({ status: 'unlocked' });
    }

    let questions;

    // Anti-refresh: return same 3 questions
    if (progress.currentQuestions.umbrella && progress.currentQuestions.umbrella.length === 3) {
      questions = await Question.find({
        _id: { $in: progress.currentQuestions.umbrella }
      }).select('-correctAnswer');
    } else {
      const allQuestions = await Question.find({ type: 'mcq' });
      if (allQuestions.length < 3) {
        return res.status(404).json({ message: 'Not enough MCQ questions in DB' });
      }

      // Shuffle and pick 3
      const shuffled = allQuestions.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3);

      progress.currentQuestions.umbrella = selected.map(q => q._id);
      await progress.save();

      questions = await Question.find({
        _id: { $in: progress.currentQuestions.umbrella }
      }).select('-correctAnswer');
    }

    res.json({ questions });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

const submitUmbrella = async (req, res) => {
  const { answers } = req.body; // { questionId: answer, ... }
  try {
    const progress = await getProgress(req.team.teamId);
    if (!progress) return res.status(404).json({ message: 'Progress not found' });

    if (progress.locks.umbrella === 'permanently_locked') {
      return res.status(403).json({ message: 'Round permanently locked' });
    }
    if (progress.locks.umbrella === 'unlocked') {
      return res.json({ message: 'Already unlocked', correct: true });
    }

    if (!progress.currentQuestions.umbrella || progress.currentQuestions.umbrella.length !== 3) {
      return res.status(400).json({ message: 'No questions assigned, fetch questions first' });
    }

    // Fetch all 3 questions with correct answers
    const questions = await Question.find({
      _id: { $in: progress.currentQuestions.umbrella }
    });

    let allCorrect = true;

    for (const q of questions) {
      const userAnswer = answers[q._id.toString()];
      if (!userAnswer || userAnswer.trim().toLowerCase() !== q.correctAnswer.trim().toLowerCase()) {
        allCorrect = false;
        break;
      }
    }

    if (allCorrect) {
      progress.locks.umbrella = 'unlocked';
      progress.completedRounds += 1;
      progress.endTime = new Date(); // Record completion time
    } else {
      progress.locks.umbrella = 'permanently_locked';
    }

    await progress.save();

    const response = {
      correct: allCorrect,
      locks: progress.locks,
      completedRounds: progress.completedRounds
    };

    if (allCorrect) {
      const totalSeconds = Math.floor((progress.endTime - progress.startTime) / 1000);
      response.totalTime = totalSeconds;
      response.endTime = progress.endTime;
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

const completeGame = async (req, res) => {
  try {
    const progress = await getProgress(req.team.teamId);
    if (!progress) return res.status(404).json({ message: 'Progress not found' });

    if (progress.endTime) {
      return res.json({ message: 'Game already completed', progress });
    }

    progress.endTime = new Date();

    // Lock all unattempted rounds
    const rounds = ['redGreen', 'circle', 'triangle', 'square', 'umbrella'];
    rounds.forEach(round => {
      if (progress.locks[round] === 'locked') {
        progress.locks[round] = 'permanently_locked';
      }
    });

    await progress.save();

    const totalSeconds = Math.floor((progress.endTime - progress.startTime) / 1000);
    res.json({
      message: 'Game completed due to timeout',
      endTime: progress.endTime,
      totalTime: totalSeconds,
      locks: progress.locks,
      completedRounds: progress.completedRounds
    });
  } catch (error) {
    res.status(500).json({ message: 'Error completing game', error: error.message });
  }
};

module.exports = {
  getStatus,
  getRedGreen, submitRedGreen,
  getCircle, submitCircle,
  getTriangle, submitTriangle,
  getSquare, submitSquare,
  getUmbrella, submitUmbrella,
  completeGame
};
