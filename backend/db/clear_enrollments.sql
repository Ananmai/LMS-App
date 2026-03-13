USE lms_db;
-- Clear all enrollments for user 7 (chinnu) so they can enroll fresh
DELETE FROM enrollments WHERE user_id = 7;
-- Verify
SELECT COUNT(*) as remaining_enrollments FROM enrollments WHERE user_id = 7;
