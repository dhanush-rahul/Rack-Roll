import { Router } from 'express';
const router = Router();
import { getPlayersByLocation, searchPlayers, createPlayer, getAllPlayers, getPlayerById, updatePlayer, deletePlayer } from '../controllers/playerController.js';

router.get('/location', getPlayersByLocation);
router.get('/search', searchPlayers);
router.post('/', createPlayer);
router.get('/', getAllPlayers);
router.get('/:id', getPlayerById);
router.put('/:id', updatePlayer);
router.delete('/:id', deletePlayer);

export default router;
