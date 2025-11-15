CREATE TABLE IF NOT EXISTS destinations (
  id CHAR(36) NOT NULL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(500),
  location VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  category_id CHAR(36) NULL,
  facilities VARCHAR(2048) NOT NULL DEFAULT '[]',
  best_time_to_visit VARCHAR(255),
  entrance_fee VARCHAR(100),
  rating DECIMAL(2,1) DEFAULT 4.5,
  google_maps_link VARCHAR(500),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_destinations_category (category),
  KEY idx_destinations_rating (rating)
);

CREATE TABLE IF NOT EXISTS culinary (
  id CHAR(36) NOT NULL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(500),
  restaurant VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  price_range VARCHAR(100),
  opening_hours VARCHAR(255),
  specialties VARCHAR(2048) NOT NULL DEFAULT '[]',
  rating DECIMAL(3,1) DEFAULT 4.5,
  category VARCHAR(100) NOT NULL,
  category_id CHAR(36) NULL,
  google_maps_link VARCHAR(500),
  facilities VARCHAR(2048) DEFAULT '[]',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_culinary_category (category),
  KEY idx_culinary_rating (rating)
);

-- ============================================
-- 2. CREATE AUTHENTICATION TABLES
-- ============================================

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

-- ============================================
-- 3. CREATE CAROUSEL TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS carousel_slides (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image VARCHAR(500),
  button_text_1 VARCHAR(100),
  button_link_1 VARCHAR(255),
  button_text_2 VARCHAR(100),
  button_link_2 VARCHAR(255),
  slide_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- 4. CREATE CATEGORIES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS categories (
  id CHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  type ENUM('destination','culinary') NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY idx_categories_type (type),
  KEY idx_categories_slug (slug)
);

-- ============================================
-- 5. CREATE FACILITIES PRESETS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS facility_presets (
  id CHAR(36) NOT NULL PRIMARY KEY,
  type ENUM('destination', 'culinary') NOT NULL,
  name VARCHAR(100) NOT NULL,
  icon_name VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_type_name (type, name),
  KEY idx_facility_type (type)
) COMMENT 'Predefined facilities/amenities for quick selection';

INSERT INTO users (id, email, password_hash, username, role)
VALUES ('da15105e-9f0b-475e-b326-14907ec3454e', 'admin@explorekarawang.com', '$2a$10$.0u1G0RdWq3v0TYHbvy7QeSqh2WQlkGnGr2nf6KUxjY.Lhz9m67LO', 'admin', 'admin')
ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash), role='admin';

-- Insert default carousel slides
INSERT INTO carousel_slides (id, title, description, image, button_text_1, button_link_1, button_text_2, button_link_2, slide_order, is_active) VALUES
(UUID(), 'Discover Karawang', 'Experience the hidden gems of West Java''s cultural and culinary paradise', '/placeholder.svg?height=1080&width=1920', 'Explore Destinations', '/destinations', 'Culinary Adventures', '/culinary', 1, TRUE),
(UUID(), 'Natural Beauty', 'Explore stunning beaches, waterfalls, and lush landscapes', '/placeholder.svg?height=1080&width=1920', 'Explore Destinations', '/destinations', 'Culinary Adventures', '/culinary', 2, TRUE),
(UUID(), 'Rich Heritage', 'Immerse yourself in the historical and cultural treasures of Karawang', '/placeholder.svg?height=1080&width=1920', 'Explore Destinations', '/destinations', 'Culinary Adventures', '/culinary', 3, TRUE)
ON DUPLICATE KEY UPDATE id=id;

-- Insert default culinary facilities
INSERT INTO facility_presets (id, type, name, icon_name) VALUES
(UUID(), 'culinary', 'WiFi', 'wifi'),
(UUID(), 'culinary', 'Parking', 'parking'),
(UUID(), 'culinary', 'Takeout', 'bag'),
(UUID(), 'culinary', 'Dine-in', 'fork-knife'),
(UUID(), 'culinary', 'Reservations', 'calendar'),
(UUID(), 'culinary', 'Outdoor Seating', 'umbrella'),
(UUID(), 'culinary', 'Private Room', 'door'),
(UUID(), 'culinary', 'Delivery', 'truck'),
(UUID(), 'culinary', 'Credit Card', 'credit-card'),
(UUID(), 'culinary', 'Cash Only', 'coins'),
(UUID(), 'culinary', 'Vegetarian Options', 'leaf'),
(UUID(), 'culinary', 'Kids Menu', 'baby'),
(UUID(), 'culinary', 'Halal', 'check'),
(UUID(), 'culinary', 'Alcohol Served', 'wine'),
(UUID(), 'culinary', 'Smoking Area', 'cigarette')
ON DUPLICATE KEY UPDATE id=id;

-- Insert default destination facilities
INSERT INTO facility_presets (id, type, name, icon_name) VALUES
(UUID(), 'destination', 'Parking', 'parking'),
(UUID(), 'destination', 'Restrooms', 'toilet'),
(UUID(), 'destination', 'Food Stalls', 'utensils'),
(UUID(), 'destination', 'Souvenir Shop', 'shopping-bag'),
(UUID(), 'destination', 'Picnic Area', 'tree'),
(UUID(), 'destination', 'Guided Tours', 'map'),
(UUID(), 'destination', 'Photography Spot', 'camera'),
(UUID(), 'destination', 'WiFi', 'wifi'),
(UUID(), 'destination', 'Medical Clinic', 'heart'),
(UUID(), 'destination', 'Prayer Room', 'prayer'),
(UUID(), 'destination', 'Accommodation', 'hotel'),
(UUID(), 'destination', 'Water Sports', 'droplet'),
(UUID(), 'destination', 'Hiking Trails', 'mountain'),
(UUID(), 'destination', 'Viewpoint', 'binoculars')
ON DUPLICATE KEY UPDATE id=id;