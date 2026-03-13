import pool from '../../config/db';

export class SubjectsService {
    async getAllSubjects() {
        const [rows]: any = await pool.query(
            'SELECT id, title, slug, description, is_published, created_at FROM subjects WHERE is_published = 1 ORDER BY created_at DESC'
        );
        return rows;
    }

    async getSubjectById(subjectId: number) {
        const [rows]: any = await pool.query('SELECT * FROM subjects WHERE id = ?', [subjectId]);
        return rows[0];
    }

    async getSubjectTree(subjectId: number) {
        const subject = await this.getSubjectById(subjectId);
        if (!subject) throw new Error('Subject not found');

        const [sections]: any = await pool.query(
            'SELECT * FROM sections WHERE subject_id = ? ORDER BY order_index',
            [subjectId]
        );

        for (const section of sections) {
            const [videos]: any = await pool.query(
                'SELECT * FROM videos WHERE section_id = ? ORDER BY order_index',
                [section.id]
            );
            section.videos = videos;
        }

        subject.sections = sections;
        return subject;
    }
}
