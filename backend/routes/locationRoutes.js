import { Router } from 'express';
const router = Router();
import locationController from '../controllers/locationController.js';

router.post('/', locationController.createLocation);
router.get('/', locationController.getAllLocations);
router.get('/:locationId/players', locationController.getPlayersByLocation);
router.post('/verify', locationController.getLocationByCredentials);
router.post('/signin', locationController.signInLocation);
router.put('/:id', locationController.updateLocation);
router.delete('/:id', locationController.deleteLocation);

export default router;
