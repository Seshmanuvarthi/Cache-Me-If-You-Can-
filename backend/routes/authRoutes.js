const express = require('express');
const router = express.Router();
const { loginTeam } = require('../controllers/authController');

// POST /api/auth/login
router.post('/login', loginTeam);

module.exports = router;
