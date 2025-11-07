
CREATE TABLE IF NOT EXISTS destinations (
  id CHAR(36) NOT NULL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(500),
  location VARCHAR(255) NOT NULL,
  category ENUM('nature','historical','recreational') NOT NULL,
  facilities VARCHAR(2048) NOT NULL DEFAULT '[]', -- Store JSON as string for broad MySQL/MariaDB compatibility
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
  specialties VARCHAR(2048) NOT NULL DEFAULT '[]', -- Store JSON as string for broad MySQL/MariaDB compatibility
  rating DECIMAL(3,1) DEFAULT 4.5,
  category ENUM('traditional','seafood','snack','modern') NOT NULL,
  google_maps_link VARCHAR(500),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_culinary_category (category),
  KEY idx_culinary_rating (rating)
);
