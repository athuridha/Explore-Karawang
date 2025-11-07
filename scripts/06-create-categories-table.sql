-- Create generic categories table for destinations and culinary items
CREATE TABLE IF NOT EXISTS categories (
  id CHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  type ENUM('destination','culinary') NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY idx_categories_type (type),
  KEY idx_categories_slug (slug)
);

-- Optionally add category_id columns (nullable for backward compatibility)
ALTER TABLE destinations ADD COLUMN category_id CHAR(36) NULL AFTER category;
ALTER TABLE culinary ADD COLUMN category_id CHAR(36) NULL AFTER category;

-- Change existing ENUM category columns to VARCHAR to allow dynamic values (only run once)
ALTER TABLE destinations MODIFY category VARCHAR(100) NOT NULL;
ALTER TABLE culinary MODIFY category VARCHAR(100) NOT NULL;

-- Backfill category_id where names already exist in categories table (run after inserting categories)
-- UPDATE destinations d JOIN categories c ON d.category = c.name SET d.category_id = c.id;
-- UPDATE culinary cu JOIN categories c ON cu.category = c.name SET cu.category_id = c.id;
