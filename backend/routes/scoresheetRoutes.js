const express = require('express');
const router = express.Router();
const scoresheetController = require('../controllers/scoresheetController');

router.post('/', scoresheetController.createScoresheet);
router.get('/', scoresheetController.getAllScoresheets);
router.get('/:id', scoresheetController.getScoresheetById);
router.put('/:id', scoresheetController.updateScoresheet);
router.delete('/:id', scoresheetController.deleteScoresheet);

module.exports = router;
