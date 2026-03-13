import { Request, Response } from 'express';
import { VideosService } from './videos.service';

const videosService = new VideosService();

export class VideosController {
    async getVideo(req: Request, res: Response) {
        try {
            const { videoId } = req.params;
            const id = parseInt(videoId as string);
            if (isNaN(id)) return res.status(400).json({ message: 'Invalid video ID' });

            const video = await videosService.getVideoById(id);
            if (!video) return res.status(404).json({ message: 'Video not found' });

            res.json(video);
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    async getFirstVideo(req: Request, res: Response) {
        try {
            const { subjectId } = req.params;
            const id = parseInt(subjectId as string);
            if (isNaN(id)) return res.status(400).json({ message: 'Invalid subject ID' });

            const video = await videosService.getFirstVideoBySubjectId(id);
            if (!video) return res.status(404).json({ message: 'No videos found for this subject' });

            res.json(video);
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }
}
