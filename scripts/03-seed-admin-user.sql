-- Seed admin user (username: admin, password: admin)
-- Safe to re-run: updates password/role if user already exists
INSERT INTO users (id, email, password_hash, username, role)
VALUES ('da15105e-9f0b-475e-b326-14907ec3454e', 'admin@example.com', '$2a$10$.0u1G0RdWq3v0TYHbvy7QeSqh2WQlkGnGr2nf6KUxjY.Lhz9m67LO', 'admin', 'admin')
ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash), role='admin';
