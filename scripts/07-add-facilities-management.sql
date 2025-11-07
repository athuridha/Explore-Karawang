-- Add facilities column to culinary table
-- This migration adds support for restaurant facilities management

ALTER TABLE culinary ADD COLUMN facilities VARCHAR(2048) DEFAULT '[]' COMMENT 'Store JSON array of facilities as string';

-- Create facilities management table for defaults and presets
CREATE TABLE IF NOT EXISTS facility_presets (
  id CHAR(36) NOT NULL PRIMARY KEY,
  type ENUM('destination', 'culinary') NOT NULL,
  name VARCHAR(100) NOT NULL,
  icon_name VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_type_name (type, name),
  KEY idx_facility_type (type)
) COMMENT 'Predefined facilities/amenities for quick selection';

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
ON DUPLICATE KEY UPDATE id=UUID();

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
ON DUPLICATE KEY UPDATE id=UUID();
