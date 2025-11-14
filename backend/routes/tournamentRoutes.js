import { Router } from 'express';
const router = Router();
import tournamentController from '../controllers/tournamentController.js';

router.post('/create-with-games', tournamentController.createTournamentWithGames);
router.post('/', tournamentController.createTournament);
router.put('/:tournamentId/add-rounds', tournamentController.addRound)
router.get('/', tournamentController.getAllTournaments);
router.get('/:id', tournamentController.getTournamentById);
router.get('/:tournamentId/scoresheet', tournamentController.getScoresheet);
router.get('/:id/details', tournamentController.getTournamentDetails); 
router.get('/location/:locationId', tournamentController.getTournamentsByLocation);

// router.get('/:tournamentId/scores')

router.put('/:id', tournamentController.updateTournament);
router.delete('/:id', tournamentController.deleteTournament);
router.get('/count/location/:locationId', tournamentController.getLocationTournamentCount);
router.post('/:tournamentId/players', tournamentController.addPlayerToTournament);

export default router;
