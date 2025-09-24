-- Create albums table
CREATE TABLE IF NOT EXISTS albums (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE,
  category VARCHAR(100),
  image_url TEXT, -- Main/thumbnail image URL
  image_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create album_images table for storing multiple images per album
CREATE TABLE IF NOT EXISTS album_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  album_id UUID REFERENCES albums(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_order INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_albums_date ON albums(date);
CREATE INDEX IF NOT EXISTS idx_albums_category ON albums(category);
CREATE INDEX IF NOT EXISTS idx_albums_created_at ON albums(created_at);
CREATE INDEX IF NOT EXISTS idx_album_images_album_id ON album_images(album_id);
CREATE INDEX IF NOT EXISTS idx_album_images_order ON album_images(album_id, image_order);

-- Enable Row Level Security (RLS)
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE album_images ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to albums" ON albums
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to album_images" ON album_images
  FOR SELECT USING (true);

-- Create policies for admin access (you may need to adjust these based on your auth setup)
CREATE POLICY "Allow admin insert on albums" ON albums
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin update on albums" ON albums
  FOR UPDATE USING (true);

CREATE POLICY "Allow admin delete on albums" ON albums
  FOR DELETE USING (true);

CREATE POLICY "Allow admin insert on album_images" ON album_images
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin update on album_images" ON album_images
  FOR UPDATE USING (true);

CREATE POLICY "Allow admin delete on album_images" ON album_images
  FOR DELETE USING (true);

-- Function to update image_count when album_images change
CREATE OR REPLACE FUNCTION update_album_image_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE albums 
    SET image_count = (
      SELECT COUNT(*) 
      FROM album_images 
      WHERE album_id = NEW.album_id
    )
    WHERE id = NEW.album_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE albums 
    SET image_count = (
      SELECT COUNT(*) 
      FROM album_images 
      WHERE album_id = OLD.album_id
    )
    WHERE id = OLD.album_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update image_count
DROP TRIGGER IF EXISTS trigger_update_album_image_count ON album_images;
CREATE TRIGGER trigger_update_album_image_count
  AFTER INSERT OR UPDATE OR DELETE ON album_images
  FOR EACH ROW EXECUTE FUNCTION update_album_image_count();

