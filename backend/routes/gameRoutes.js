const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.post('/', gameController.createGame);
router.get('/max-rounds', gameController.getMaxRounds)
router.get('/', gameController.getAllGames);
router.get('/:id', gameController.getGameById);
router.put('/:id', gameController.updateGame);
router.patch('/:id/scores', gameController.updateGameWithId);
router.delete('/:id', gameController.deleteGame);

module.exports = router;
