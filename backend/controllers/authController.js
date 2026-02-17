const jwt = require('jsonwebtoken');
const Team = require('../models/Team');
const Progress = require('../models/Progress');

/**
 * Generate JWT token for team
 */
const generateToken = (teamId) => {
  return jwt.sign({ teamId }, process.env.JWT_SECRET, { expiresIn: '8h' });
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate team and return JWT token
 * @access  Public
 */
const loginTeam = async (req, res) => {
  const { teamId, password } = req.body;

  if (!teamId || !password) {
    return res.status(400).json({ message: 'Please provide teamId and password' });
  }

  try {
    // Find team by teamId (case-insensitive via uppercase model)
    const team = await Team.findOne({ teamId: teamId.toUpperCase() });

    if (!team) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await team.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if progress already exists for this team
    let progress = await Progress.findOne({ teamId: team.teamId });

    if (!progress) {
      // First login → create progress with startTime
      progress = await Progress.create({
        teamId: team.teamId,
        startTime: new Date()
      });
      console.log(`✅ New progress created for ${team.teamId}`);
    } else if (!progress.endTime) {
      // Existing progress, not completed: adjust startTime to pause timer during logout
      const now = Date.now();
      const elapsed = (now - progress.startTime) / 1000;
      const totalTime = 30 * 60;
      const currentRemaining = Math.max(0, totalTime - elapsed);
      progress.startTime = new Date(now - (totalTime - currentRemaining) * 1000);
      await progress.save();
    }

    // Generate JWT
    const token = generateToken(team.teamId);

    res.json({
      token,
      teamId: team.teamId,
      progress: {
        startTime: progress.startTime,
        completedRounds: progress.completedRounds,
        locks: progress.locks
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

module.exports = { loginTeam };
