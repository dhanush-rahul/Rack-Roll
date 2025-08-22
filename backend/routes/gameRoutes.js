import { Router } from 'express';
const router = Router();
import gameController from '../controllers/gameController';

router.post('/', gameController.createGame);
router.get('/max-rounds', gameController.getMaxRounds)
router.get('/', gameController.getAllGames);
router.get('/:id', gameController.getGameById);
router.put('/:id', gameController.updateGame);
router.patch('/:id/scores', gameController.updateGameWithId);
router.delete('/:id', gameController.deleteGame);

export default router;
