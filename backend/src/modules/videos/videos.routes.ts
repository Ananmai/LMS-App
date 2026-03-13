import { Router } from 'express';
import { VideosController } from './videos.controller';

const router = Router();
const controller = new VideosController();

router.get('/:videoId', controller.getVideo);
router.get('/subjects/:subjectId/first-video', controller.getFirstVideo);

export default router;
