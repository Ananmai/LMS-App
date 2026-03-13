import { Router } from 'express';
import { SubjectsController } from './subjects.controller';

const router = Router();
const controller = new SubjectsController();

router.get('/', controller.getAll);
router.get('/:subjectId', controller.getById);
router.get('/:subjectId/tree', controller.getTree);

export default router;
