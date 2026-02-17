const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getStatus,
  getRedGreen, submitRedGreen,
  getCircle, submitCircle,
  getTriangle, submitTriangle,
  getSquare, submitSquare,
  getUmbrella, submitUmbrella,
  completeGame
} = require('../controllers/gameController');

// All routes protected with JWT middleware
router.use(protect);

// GET game status
router.get('/status', getStatus);

// Complete game (timeout)
router.post('/complete', completeGame);

// Round 1: Red Light Green Light
router.get('/redgreen', getRedGreen);
router.post('/redgreen/submit', submitRedGreen);

// Round 2: Circle
router.get('/circle', getCircle);
router.post('/circle/submit', submitCircle);

// Round 3: Triangle
router.get('/triangle', getTriangle);
router.post('/triangle/submit', submitTriangle);

// Round 4: Square (Cows & Bulls)
router.get('/square', getSquare);
router.post('/square/submit', submitSquare);

// Round 5: Umbrella (MCQ)
router.get('/umbrella', getUmbrella);
router.post('/umbrella/submit', submitUmbrella);

module.exports = router;
