import { Router } from 'express';
import { EnrollmentsController } from './enrollments.controller';
import { authenticateToken } from '../../middleware/authMiddleware';

const router = Router();
const controller = new EnrollmentsController();

router.use(authenticateToken);

router.post('/:subjectId', controller.enroll);
router.get('/', controller.getMyEnrollments);

export default router;
