import { Response } from 'express';
import { AuthRequest } from '../../middleware/authMiddleware';
import { EnrollmentsService } from './enrollments.service';

const enrollmentsService = new EnrollmentsService();

export class EnrollmentsController {
    async enroll(req: AuthRequest, res: Response) {
        try {
            const { subjectId } = req.params;
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: 'User not authenticated' });

            const id = parseInt(subjectId as string);
            if (isNaN(id)) return res.status(400).json({ message: 'Invalid subject ID' });

            const result = await enrollmentsService.enroll(userId, id);
            res.json(result);
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }

    async getMyEnrollments(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: 'User not authenticated' });

            const enrollments = await enrollmentsService.getMyEnrollments(userId);
            res.json(enrollments);
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }
}
