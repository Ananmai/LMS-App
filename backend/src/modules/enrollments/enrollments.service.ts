import pool from '../../config/db';

export class EnrollmentsService {
    async enroll(userId: number, subjectId: number) {
        // Check if subject exists
        const [subject]: any = await pool.query('SELECT id FROM subjects WHERE id = ?', [subjectId]);
        if (subject.length === 0) throw new Error('Subject not found');

        // Check if already enrolled
        const [existing]: any = await pool.query(
            'SELECT id FROM enrollments WHERE user_id = ? AND subject_id = ?',
            [userId, subjectId]
        );
        if (existing.length > 0) return { message: 'Already enrolled' };

        await pool.query('INSERT INTO enrollments (user_id, subject_id) VALUES (?, ?)', [userId, subjectId]);
        return { message: 'Enrollment successful' };
    }

    async getMyEnrollments(userId: number) {
        const [rows]: any = await pool.query(
            `SELECT e.*, s.title, s.slug, s.description
       FROM enrollments e
       JOIN subjects s ON e.subject_id = s.id
       WHERE e.user_id = ?`,
            [userId]
        );
        return rows;
    }
}
