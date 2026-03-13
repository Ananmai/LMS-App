import pool from '../../config/db';

export class ProgressService {
    async getVideoProgress(videoId: number, userId: number) {
        const [rows]: any = await pool.query(
            'SELECT * FROM video_progress WHERE user_id = ? AND video_id = ?',
            [userId, videoId]
        );
        return rows[0] || { last_position_seconds: 0, is_completed: false };
    }

    async saveProgress(userId: number, videoId: number, lastPosition: number, isCompleted: boolean) {
        const completedAt = isCompleted ? new Date() : null;
        await pool.query(
            `INSERT INTO video_progress (user_id, video_id, last_position_seconds, is_completed, completed_at)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         last_position_seconds = VALUES(last_position_seconds),
         is_completed = VALUES(is_completed),
         completed_at = IF(VALUES(is_completed), IFNULL(completed_at, NOW()), completed_at)`,
            [userId, videoId, lastPosition, isCompleted, completedAt]
        );
    }

    async getSubjectProgress(subjectId: number, userId: number) {
        const [rows]: any = await pool.query(
            `SELECT vp.*, v.title as video_title, s.title as section_title
       FROM video_progress vp
       JOIN videos v ON vp.video_id = v.id
       JOIN sections s ON v.section_id = s.id
       WHERE s.subject_id = ? AND vp.user_id = ?`,
            [subjectId, userId]
        );
        return rows;
    }
}
