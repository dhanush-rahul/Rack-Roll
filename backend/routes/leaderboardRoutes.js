import { Router } from 'express';
const router = Router();
import leaderboardController from '../controllers/leaderboardController.js';

router.post('/', leaderboardController.createLeaderboard);
router.get('/', leaderboardController.getAllLeaderboards);
router.get('/tournament/:tournamentId/division/:divisionId', leaderboardController.getLeaderboard);
router.put('/:id', leaderboardController.updateLeaderboard);
router.delete('/:id', leaderboardController.deleteLeaderboard);

export default router;
