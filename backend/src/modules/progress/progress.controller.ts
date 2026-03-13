import { Response } from 'express';
import { AuthRequest } from '../../middleware/authMiddleware';
import { ProgressService } from './progress.service';

const progressService = new ProgressService();

export class ProgressController {
    async getProgress(req: AuthRequest, res: Response) {
        try {
            const { videoId } = req.params;
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: 'User not authenticated' });

            const id = parseInt(videoId as string);
            if (isNaN(id)) return res.status(400).json({ message: 'Invalid video ID' });

            const progress = await progressService.getVideoProgress(id, userId);
            res.json(progress);
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    async saveProgress(req: AuthRequest, res: Response) {
        try {
            const { videoId } = req.params;
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: 'User not authenticated' });

            const id = parseInt(videoId as string);
            if (isNaN(id)) return res.status(400).json({ message: 'Invalid video ID' });

            const { last_position_seconds, is_completed } = req.body;
            await progressService.saveProgress(userId, id, last_position_seconds, is_completed);

            res.json({ message: 'Progress saved successfully' });
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    async getSubjectProgress(req: AuthRequest, res: Response) {
        try {
            const { subjectId } = req.params;
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: 'User not authenticated' });

            const id = parseInt(subjectId as string);
            if (isNaN(id)) return res.status(400).json({ message: 'Invalid subject ID' });

            const progress = await progressService.getSubjectProgress(id, userId);
            res.json(progress);
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }
}
