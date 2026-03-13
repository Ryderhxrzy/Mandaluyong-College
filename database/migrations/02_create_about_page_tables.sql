-- 1. Banner Section
CREATE TABLE IF NOT EXISTS public.banner_about_page (
  id BIGSERIAL PRIMARY KEY,
  background_image VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Key Statistics Section (Main)
CREATE TABLE IF NOT EXISTS public.key_statistics_about_page (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Key Statistics Items (Stats Cards)
CREATE TABLE IF NOT EXISTS public.key_statistics_items_about_page (
  id BIGSERIAL PRIMARY KEY,
  statistics_id BIGSERIAL REFERENCES public.key_statistics_about_page(id) ON DELETE CASCADE,
  value VARCHAR(50) NOT NULL,
  label VARCHAR(255) NOT NULL,
  "order" INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Key Statistics Images Table (4 images grid)
CREATE TABLE IF NOT EXISTS public.key_statistics_images_about_page (
  id BIGSERIAL PRIMARY KEY,
  statistics_id BIGSERIAL REFERENCES public.key_statistics_about_page(id) ON DELETE CASCADE,
  image VARCHAR(255) NOT NULL,
  alt_text VARCHAR(255),
  "order" INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Goals Section
CREATE TABLE IF NOT EXISTS public.goals_about_page (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Goals Items Table
CREATE TABLE IF NOT EXISTS public.goals_items_about_page (
  id BIGSERIAL PRIMARY KEY,
  goals_id BIGSERIAL REFERENCES public.goals_about_page(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  "order" INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Philosophy Section (with image)
CREATE TABLE IF NOT EXISTS public.philosophy_about_page (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(255),
  image_alt VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Mission & Vision Section
CREATE TABLE IF NOT EXISTS public.mission_vision_about_page (
  id BIGSERIAL PRIMARY KEY,
  mission TEXT NOT NULL,
  vision TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Core Values Section
CREATE TABLE IF NOT EXISTS public.core_values_about_page (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image VARCHAR(255),
  campus_title VARCHAR(255),
  campus_description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Core Values Items Table
CREATE TABLE IF NOT EXISTS public.core_values_items_about_page (
  id BIGSERIAL PRIMARY KEY,
  core_values_id BIGSERIAL REFERENCES public.core_values_about_page(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  "order" INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Why Choose MCST Section
CREATE TABLE IF NOT EXISTS public.why_choose_about_page (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Why Choose MCST Cards Table
CREATE TABLE IF NOT EXISTS public.why_choose_cards_about_page (
  id BIGSERIAL PRIMARY KEY,
  why_choose_id BIGSERIAL REFERENCES public.why_choose_about_page(id) ON DELETE CASCADE,
  icon VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon_color VARCHAR(7),
  icon_bg_color_light VARCHAR(7),
  icon_bg_color_dark VARCHAR(7),
  "order" INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Join Community Section
CREATE TABLE IF NOT EXISTS public.join_community_about_page (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Join Community Images Table
CREATE TABLE IF NOT EXISTS public.join_community_images_about_page (
  id BIGSERIAL PRIMARY KEY,
  join_community_id BIGSERIAL REFERENCES public.join_community_about_page(id) ON DELETE CASCADE,
  image VARCHAR(255) NOT NULL,
  alt_text VARCHAR(255),
  "order" INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_banner_about_page_active ON public.banner_about_page(is_active);
CREATE INDEX idx_key_statistics_about_page_active ON public.key_statistics_about_page(is_active);
CREATE INDEX idx_key_statistics_items_about_page_order ON public.key_statistics_items_about_page("order");
CREATE INDEX idx_key_statistics_images_about_page_order ON public.key_statistics_images_about_page("order");
CREATE INDEX idx_goals_about_page_active ON public.goals_about_page(is_active);
CREATE INDEX idx_goals_items_about_page_order ON public.goals_items_about_page("order");
CREATE INDEX idx_philosophy_about_page_active ON public.philosophy_about_page(is_active);
CREATE INDEX idx_mission_vision_about_page_active ON public.mission_vision_about_page(is_active);
CREATE INDEX idx_core_values_about_page_active ON public.core_values_about_page(is_active);
CREATE INDEX idx_core_values_items_about_page_order ON public.core_values_items_about_page("order");
CREATE INDEX idx_why_choose_about_page_active ON public.why_choose_about_page(is_active);
CREATE INDEX idx_why_choose_cards_about_page_order ON public.why_choose_cards_about_page("order");
CREATE INDEX idx_join_community_about_page_active ON public.join_community_about_page(is_active);

-- Enable RLS (Row Level Security)
ALTER TABLE public.banner_about_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.key_statistics_about_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.key_statistics_items_about_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.key_statistics_images_about_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals_about_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals_items_about_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.philosophy_about_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_vision_about_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.core_values_about_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.core_values_items_about_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.why_choose_about_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.why_choose_cards_about_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.join_community_about_page ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read" ON public.banner_about_page
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read" ON public.key_statistics_about_page
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read" ON public.key_statistics_items_about_page
  FOR SELECT USING (true);

CREATE POLICY "Allow public read" ON public.key_statistics_images_about_page
  FOR SELECT USING (true);

CREATE POLICY "Allow public read" ON public.goals_about_page
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read" ON public.goals_items_about_page
  FOR SELECT USING (true);

CREATE POLICY "Allow public read" ON public.philosophy_about_page
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read" ON public.mission_vision_about_page
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read" ON public.core_values_about_page
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read" ON public.core_values_items_about_page
  FOR SELECT USING (true);

CREATE POLICY "Allow public read" ON public.why_choose_about_page
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read" ON public.why_choose_cards_about_page
  FOR SELECT USING (true);

CREATE POLICY "Allow public read" ON public.join_community_about_page
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read" ON public.join_community_images_about_page
  FOR SELECT USING (true);
