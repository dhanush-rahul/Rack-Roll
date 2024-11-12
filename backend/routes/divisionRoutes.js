const express = require('express');
const router = express.Router();
const divisionController = require('../controllers/divisionController');

router.post('/', divisionController.createDivision);
router.get('/', divisionController.getAllDivisions);
router.get('/:id', divisionController.getDivisionById);
router.put('/:id', divisionController.updateDivision);
router.delete('/:id', divisionController.deleteDivision);

module.exports = router;
