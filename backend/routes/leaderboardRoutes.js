const express = require('express');
const router = express.Router();
const { getLeaderboard } = require('../controllers/leaderboardController');

// Public route - leaderboard visible to all
router.get('/', getLeaderboard);

module.exports = router;
