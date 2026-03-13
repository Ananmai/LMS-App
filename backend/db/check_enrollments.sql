USE lms_db;
SELECT e.id, e.user_id, e.subject_id, s.title FROM enrollments e JOIN subjects s ON e.subject_id = s.id;
