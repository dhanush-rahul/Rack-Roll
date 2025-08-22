import { Router } from 'express';
const router = Router();
import divisionController from '../controllers/divisionController';

router.post('/', divisionController.createDivision);
router.get('/', divisionController.getAllDivisions);
router.get('/:id', divisionController.getDivisionById);
router.put('/:id', divisionController.updateDivision);
router.delete('/:id', divisionController.deleteDivision);

export default router;
