USE lms_db;

INSERT IGNORE INTO subjects (title, slug, description, is_published) VALUES
('Node.js & Express Backend', 'nodejs-express-backend', 'Build scalable REST APIs and backend services with Node.js, Express and MongoDB.', 1),
('Cybersecurity Fundamentals', 'cybersecurity-fundamentals', 'Learn ethical hacking, network security, cryptography and penetration testing basics.', 1),
('Flutter & Dart Mobile Dev', 'flutter-dart-mobile', 'Build beautiful cross-platform iOS and Android apps using Flutter and Dart.', 1),
('GraphQL & API Design', 'graphql-api-design', 'Master GraphQL schema design, resolvers, mutations and integrate with React frontends.', 1);

-- Add sections for Node.js
INSERT IGNORE INTO sections (subject_id, title, order_index)
SELECT id, 'Node.js Fundamentals', 1 FROM subjects WHERE slug = 'nodejs-express-backend';
INSERT IGNORE INTO sections (subject_id, title, order_index)
SELECT id, 'Building REST APIs with Express', 2 FROM subjects WHERE slug = 'nodejs-express-backend';

-- Add sections for Cybersecurity
INSERT IGNORE INTO sections (subject_id, title, order_index)
SELECT id, 'Security Basics & Networking', 1 FROM subjects WHERE slug = 'cybersecurity-fundamentals';
INSERT IGNORE INTO sections (subject_id, title, order_index)
SELECT id, 'Ethical Hacking Techniques', 2 FROM subjects WHERE slug = 'cybersecurity-fundamentals';

-- Add sections for Flutter
INSERT IGNORE INTO sections (subject_id, title, order_index)
SELECT id, 'Flutter & Dart Basics', 1 FROM subjects WHERE slug = 'flutter-dart-mobile';
INSERT IGNORE INTO sections (subject_id, title, order_index)
SELECT id, 'Building Full Apps', 2 FROM subjects WHERE slug = 'flutter-dart-mobile';

-- Add sections for GraphQL
INSERT IGNORE INTO sections (subject_id, title, order_index)
SELECT id, 'GraphQL Fundamentals', 1 FROM subjects WHERE slug = 'graphql-api-design';
INSERT IGNORE INTO sections (subject_id, title, order_index)
SELECT id, 'Advanced Queries & Subscriptions', 2 FROM subjects WHERE slug = 'graphql-api-design';
