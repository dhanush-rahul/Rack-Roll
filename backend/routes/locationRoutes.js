const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

router.post('/', locationController.createLocation);
router.get('/', locationController.getAllLocations);
router.get('/:locationId/players', locationController.getPlayersByLocation);
router.post('/verify', locationController.getLocationByCredentials);
router.post('/signin', locationController.signInLocation);
router.put('/:id', locationController.updateLocation);
router.delete('/:id', locationController.deleteLocation);

module.exports = router;
