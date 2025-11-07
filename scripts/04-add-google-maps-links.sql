-- Add google_maps_link column to existing tables
-- Run this if tables already exist

ALTER TABLE destinations 
ADD COLUMN IF NOT EXISTS google_maps_link VARCHAR(500) AFTER rating;

ALTER TABLE culinary 
ADD COLUMN IF NOT EXISTS google_maps_link VARCHAR(500) AFTER category;
