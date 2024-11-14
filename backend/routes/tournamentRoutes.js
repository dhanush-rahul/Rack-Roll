const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');

router.post('/', tournamentController.createTournament);
router.get('/', tournamentController.getAllTournaments);
router.get('/:id', tournamentController.getTournamentById);
router.put('/:id', tournamentController.updateTournament);
router.delete('/:id', tournamentController.deleteTournament);
router.get('/count/location/:locationId', tournamentController.getLocationTournamentCount);

module.exports = router;
