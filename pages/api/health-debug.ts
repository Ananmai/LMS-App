import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../backend/src/config/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const [rows]: any = await pool.query('SELECT 1 as connection_test');
        res.status(200).json({ 
            status: 'ok', 
            database: 'connected', 
            test: rows[0].connection_test,
            env: {
                has_db_url: !!process.env.DATABASE_URL,
                node_env: process.env.NODE_ENV
            }
        });
    } catch (error: any) {
        res.status(500).json({ 
            status: 'error', 
            database: 'failed', 
            message: error.message,
            code: error.code
        });
    }
}
