import { Router } from 'express';
import { ProgressController } from './progress.controller';
import { authenticateToken } from '../../middleware/authMiddleware';

const router = Router();
const controller = new ProgressController();

router.use(authenticateToken);

router.get('/videos/:videoId', controller.getProgress);
router.post('/videos/:videoId', controller.saveProgress);
router.get('/subjects/:subjectId', controller.getSubjectProgress);

export default router;
