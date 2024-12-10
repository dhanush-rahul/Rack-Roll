const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');

router.post('/', leaderboardController.createLeaderboard);
router.get('/', leaderboardController.getAllLeaderboards);
router.get('/tournament/:tournamentId/division/:divisionId', leaderboardController.getLeaderboard);
router.put('/:id', leaderboardController.updateLeaderboard);
router.delete('/:id', leaderboardController.deleteLeaderboard);

module.exports = router;
