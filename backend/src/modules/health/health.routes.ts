import { Request, Response, Router } from 'express';
import pool from '../../config/db';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    let dbStatus = 'ok';
    try {
        await pool.query('SELECT 1');
    } catch (err) {
        dbStatus = 'disconnected';
    }

    res.json({
        status: 'ok',
        database: dbStatus,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
    });
});

export default router;
