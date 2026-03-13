import { Request, Response } from 'express';
import { SubjectsService } from './subjects.service';

const subjectsService = new SubjectsService();

export class SubjectsController {
    async getAll(req: Request, res: Response) {
        try {
            const subjects = await subjectsService.getAllSubjects();
            res.json(subjects);
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const { subjectId } = req.params;
            const id = parseInt(subjectId as string);
            if (isNaN(id)) return res.status(400).json({ message: 'Invalid subject ID' });

            const subject = await subjectsService.getSubjectById(id);
            if (!subject) return res.status(404).json({ message: 'Subject not found' });

            res.json(subject);
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    async getTree(req: Request, res: Response) {
        try {
            const { subjectId } = req.params;
            const id = parseInt(subjectId as string);
            if (isNaN(id)) return res.status(400).json({ message: 'Invalid subject ID' });

            const subject = await subjectsService.getSubjectTree(id);
            res.json(subject);
        } catch (err: any) {
            res.status(404).json({ message: err.message });
        }
    }
}
