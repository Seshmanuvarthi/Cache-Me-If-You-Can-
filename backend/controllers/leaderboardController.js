const Progress = require('../models/Progress');

/**
 * @route   GET /api/leaderboard
 * @desc    Get sorted leaderboard of completed teams
 * @access  Public
 */
const getLeaderboard = async (req, res) => {
  try {
    // Aggregation pipeline: only teams that finished all 5 rounds (umbrella unlocked + endTime exists + completedRounds == 5)
    const leaderboard = await Progress.aggregate([
      {
        $match: {
          'locks.umbrella': 'unlocked',
          endTime: { $ne: null },
          completedRounds: 5
        }
      },
      {
        $lookup: {
          from: 'teams',
          localField: 'teamId',
          foreignField: 'teamId',
          as: 'team'
        }
      },
      {
        $match: {
          team: { $ne: [] }
        }
      },
      {
        $addFields: {
          // Calculate totalTime in seconds
          totalTime: {
            $divide: [
              { $subtract: ['$endTime', '$startTime'] },
              1000
            ]
          }
        }
      },
      {
        $project: {
          teamId: 1,
          totalTime: { $round: ['$totalTime', 0] },
          completedRounds: 1,
          endTime: 1
        }
      },
      {
        $sort: {
          completedRounds: -1,    // Descending: most correct answers first
          totalTime: 1          // Ascending: fastest time for tie-breaker
        }
      }
    ]);

    if (!leaderboard.length) {
      return res.json({ message: 'No teams have completed the game yet', leaderboard: [] });
    }

    // Add ranking numbers
    const ranked = leaderboard.map((entry, index) => ({
      rank: index + 1,
      teamId: entry.teamId,
      totalTime: entry.totalTime,
      completedRounds: entry.completedRounds
    }));

    res.json({ leaderboard: ranked });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: 'Error fetching leaderboard', error: error.message });
  }
};

module.exports = { getLeaderboard };
