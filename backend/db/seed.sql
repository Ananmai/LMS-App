USE lms_db;

-- 1. Sample User
INSERT INTO users (email, password_hash, name) VALUES
('student@example.com', '$2a$10$XmJ0kC/v6U3fXb.vP.O3Iu6O1Dk6K6x8Y.b8q4K7r3m8Q7p7K7e6m', 'Demo Student');
-- password is 'password123'

-- 2. Sample Subjects
INSERT INTO subjects (title, slug, description, is_published) VALUES
('Complete JavaScript Masterclass', 'javascript-masterclass', 'Learn JavaScript from scratch to advanced concepts.', 1),
('Python for Data Science', 'python-data-science', 'A comprehensive course covering Python fundamentals and Data Science libraries.', 1);

-- 3. Sections
INSERT INTO sections (subject_id, title, order_index) VALUES
(1, 'Getting Started', 1),
(1, 'Advanced JS', 2),
(2, 'Python Basics', 1),
(2, 'Data Visualization', 2);

-- 4. Videos
INSERT INTO videos (section_id, title, description, youtube_url, order_index, duration_seconds) VALUES
(1, 'JS Introduction', 'Introduction to the course', 'https://www.youtube.com/watch?v=W6NZfCO5SIk', 1, 2400),
(1, 'Variables', 'Learn about let, const, and var', 'https://www.youtube.com/watch?v=edlFjlzxkSI', 2, 1800),
(2, 'Async Await', 'Mastering asynchronous programming', 'https://www.youtube.com/watch?v=PoRJizFvM7s', 1, 2700),
(3, 'Python Intro', 'Getting started with Python', 'https://www.youtube.com/watch?v=rfscVS0vtbw', 1, 3000),
(4, 'Matplotlib', 'Visualizing data with Matplotlib', 'https://www.youtube.com/watch?v=3Xc3CA655Y4', 1, 2500);

-- 5. Enrollments
INSERT INTO enrollments (user_id, subject_id) VALUES
(1, 1); -- Demo user enrolled in JS course
