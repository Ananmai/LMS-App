USE lms_db;

-- Add more subjects (courses)
INSERT IGNORE INTO subjects (title, slug, description, is_published) VALUES
('TypeScript Masterclass', 'typescript-masterclass', 'Master TypeScript from basics to advanced generics, decorators and type systems.', 1),
('DevOps with Docker & Kubernetes', 'devops-docker-kubernetes', 'Learn containerization, orchestration, CI/CD pipelines and cloud deployments.', 1),
('SQL & Database Design', 'sql-database-design', 'Design efficient databases, write complex queries and optimize performance.', 1),
('React & Next.js Complete Guide', 'react-nextjs-guide', 'Build modern full-stack web apps using React 18 and Next.js with TypeScript.', 1),
('Machine Learning with Python', 'machine-learning-python', 'Learn machine learning algorithms, neural networks and real-world AI applications.', 1),
('AWS Cloud Practitioner', 'aws-cloud-practitioner', 'Prepare for AWS certification with hands-on cloud architecture and services.', 1);

-- Get the last inserted subject IDs and add sections + videos for each
-- TypeScript Masterclass (subject_id = 3)
INSERT IGNORE INTO sections (subject_id, title, order_index)
SELECT id, 'TypeScript Fundamentals', 1 FROM subjects WHERE slug = 'typescript-masterclass';
INSERT IGNORE INTO sections (subject_id, title, order_index)
SELECT id, 'Advanced TypeScript', 2 FROM subjects WHERE slug = 'typescript-masterclass';

-- DevOps (subject_id = 4)
INSERT IGNORE INTO sections (subject_id, title, order_index)
SELECT id, 'Docker Basics', 1 FROM subjects WHERE slug = 'devops-docker-kubernetes';
INSERT IGNORE INTO sections (subject_id, title, order_index)
SELECT id, 'Kubernetes in Production', 2 FROM subjects WHERE slug = 'devops-docker-kubernetes';

-- SQL (subject_id = 5)
INSERT IGNORE INTO sections (subject_id, title, order_index)
SELECT id, 'SQL Fundamentals', 1 FROM subjects WHERE slug = 'sql-database-design';
INSERT IGNORE INTO sections (subject_id, title, order_index)
SELECT id, 'Advanced Queries & Optimization', 2 FROM subjects WHERE slug = 'sql-database-design';

-- React & Next.js (subject_id = 6)
INSERT IGNORE INTO sections (subject_id, title, order_index)
SELECT id, 'React Foundations', 1 FROM subjects WHERE slug = 'react-nextjs-guide';
INSERT IGNORE INTO sections (subject_id, title, order_index)
SELECT id, 'Next.js & Full-Stack Patterns', 2 FROM subjects WHERE slug = 'react-nextjs-guide';

-- Machine Learning (subject_id = 7)
INSERT IGNORE INTO sections (subject_id, title, order_index)
SELECT id, 'ML Fundamentals', 1 FROM subjects WHERE slug = 'machine-learning-python';
INSERT IGNORE INTO sections (subject_id, title, order_index)
SELECT id, 'Deep Learning & Neural Networks', 2 FROM subjects WHERE slug = 'machine-learning-python';

-- AWS (subject_id = 8)
INSERT IGNORE INTO sections (subject_id, title, order_index)
SELECT id, 'AWS Core Services', 1 FROM subjects WHERE slug = 'aws-cloud-practitioner';
INSERT IGNORE INTO sections (subject_id, title, order_index)
SELECT id, 'Cloud Architecture & Security', 2 FROM subjects WHERE slug = 'aws-cloud-practitioner';
