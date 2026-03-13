import pool from '../../config/db';

export class VideosService {
    async getVideoById(videoId: number) {
        const [rows]: any = await pool.query('SELECT * FROM videos WHERE id = ?', [videoId]);
        return rows[0];
    }

    async getFirstVideoBySubjectId(subjectId: number) {
        const [rows]: any = await pool.query(
            `SELECT v.* FROM videos v
       JOIN sections s ON v.section_id = s.id
       WHERE s.subject_id = ?
       ORDER BY s.order_index ASC, v.order_index ASC
       LIMIT 1`,
            [subjectId]
        );
        return rows[0];
    }
}
