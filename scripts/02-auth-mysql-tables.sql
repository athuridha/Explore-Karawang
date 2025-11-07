-- Auth tables for MySQL (phpMyAdmin compatible)
CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(100) NOT NULL UNIQUE,
  role ENUM('admin','user') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_users_role (role)
);

CREATE TABLE IF NOT EXISTS sessions (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  session_token CHAR(64) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  KEY idx_sessions_token (session_token),
  KEY idx_sessions_user (user_id)
);

-- Optional initial admin user (replace <HASHED_PASSWORD> after generating with bcrypt)
-- INSERT INTO users (id, email, password_hash, username, role) VALUES (UUID(), 'admin@example.com', '<HASHED_PASSWORD>', 'adminexplore', 'admin');
