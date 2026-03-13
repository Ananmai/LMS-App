USE lms_db;

-- Add real-ish video content for JavaScript (Subject 1)
INSERT IGNORE INTO videos (section_id, title, description, youtube_url, order_index, duration_seconds)
SELECT s.id, 'Introduction to JavaScript', 'Welcome to the course! Let\'s start with the basics.', 'W6NZfCO5SIk', 1, 600
FROM sections s JOIN subjects sub ON s.subject_id = sub.id WHERE sub.slug = 'javascript-masterclass' AND s.order_index = 1;

INSERT IGNORE INTO videos (section_id, title, description, youtube_url, order_index, duration_seconds)
SELECT s.id, 'Variables and Data Types', 'Learn about let, const, and basic types.', 'XgSjoHn3ZaQ', 2, 900
FROM sections s JOIN subjects sub ON s.subject_id = sub.id WHERE sub.slug = 'javascript-masterclass' AND s.order_index = 1;

-- Add content for Python (Subject 2)
INSERT IGNORE INTO videos (section_id, title, description, youtube_url, order_index, duration_seconds)
SELECT s.id, 'Python Setup & Hello World', 'Getting your environment ready.', '_uQrJ0TkZlc', 1, 450
FROM sections s JOIN subjects sub ON s.subject_id = sub.id WHERE sub.slug = 'python-data-science' AND s.order_index = 1;

INSERT IGNORE INTO videos (section_id, title, description, youtube_url, order_index, duration_seconds)
SELECT s.id, 'Python Lists & Tuples', 'Working with collections.', '9OeznAkyQz4', 2, 800
FROM sections s JOIN subjects sub ON s.subject_id = sub.id WHERE sub.slug = 'python-data-science' AND s.order_index = 1;

-- Add content for TypeScript (Subject 3)
INSERT IGNORE INTO videos (section_id, title, description, youtube_url, order_index, duration_seconds)
SELECT s.id, 'Why TypeScript?', 'Understanding the benefits of static typing.', 'zQnBQ4tB3ZA', 1, 300
FROM sections s JOIN subjects sub ON s.subject_id = sub.id WHERE sub.slug = 'typescript-masterclass' AND s.order_index = 1;

INSERT IGNORE INTO videos (section_id, title, description, youtube_url, order_index, duration_seconds)
SELECT s.id, 'The Type System', 'Exploring basic types in TS.', 'BwuLxPH8AVM', 2, 700
FROM sections s JOIN subjects sub ON s.subject_id = sub.id WHERE sub.slug = 'typescript-masterclass' AND s.order_index = 1;
