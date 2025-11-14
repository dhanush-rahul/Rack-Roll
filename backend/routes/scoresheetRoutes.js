import { Router } from 'express';
const router = Router();
import scoresheetController from '../controllers/scoresheetController.js';

router.post('/', scoresheetController.createScoresheet);
router.get('/', scoresheetController.getAllScoresheets);
router.get('/:id', scoresheetController.getScoresheetById);
router.put('/:id', scoresheetController.updateScoresheet);
router.delete('/:id', scoresheetController.deleteScoresheet);

export default router;
