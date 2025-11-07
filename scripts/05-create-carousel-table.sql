-- Create carousel_slides table
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

-- Insert default carousel slides
INSERT INTO carousel_slides (id, title, description, image, button_text_1, button_link_1, button_text_2, button_link_2, slide_order, is_active) VALUES
(UUID(), 'Discover Karawang', 'Experience the hidden gems of West Java''s cultural and culinary paradise', '/placeholder.svg?height=1080&width=1920', 'Explore Destinations', '/destinations', 'Culinary Adventures', '/culinary', 1, TRUE),
(UUID(), 'Natural Beauty', 'Explore stunning beaches, waterfalls, and lush landscapes', '/placeholder.svg?height=1080&width=1920', 'Explore Destinations', '/destinations', 'Culinary Adventures', '/culinary', 2, TRUE),
(UUID(), 'Rich Heritage', 'Immerse yourself in the historical and cultural treasures of Karawang', '/placeholder.svg?height=1080&width=1920', 'Explore Destinations', '/destinations', 'Culinary Adventures', '/culinary', 3, TRUE);
