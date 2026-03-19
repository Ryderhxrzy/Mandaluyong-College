-- 1. News Page Banner
CREATE TABLE IF NOT EXISTS public.news_banner (
  id BIGSERIAL PRIMARY KEY,
  image_url VARCHAR(255) DEFAULT '/banner.jpg',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. News Announcements
CREATE TABLE IF NOT EXISTS public.news_announcements (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  link_url VARCHAR(255) DEFAULT 'https://www.facebook.com/MandaluyongCST?_rdc=2&_rdr#',
  "order" INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. News CTA
CREATE TABLE IF NOT EXISTS public.news_cta (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  button_text VARCHAR(100) DEFAULT 'View All News',
  button_link VARCHAR(255) DEFAULT 'https://www.facebook.com/MandaluyongCST?_rdc=2&_rdr#',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. News CTA Images
CREATE TABLE IF NOT EXISTS public.news_cta_images (
  id BIGSERIAL PRIMARY KEY,
  news_cta_id BIGSERIAL REFERENCES public.news_cta(id) ON DELETE CASCADE,
  image_url VARCHAR(255) NOT NULL,
  "order" INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_news_banner_active ON public.news_banner(is_active);
CREATE INDEX idx_news_announcements_active ON public.news_announcements(is_active);
CREATE INDEX idx_news_announcements_order ON public.news_announcements("order");
CREATE INDEX idx_news_cta_active ON public.news_cta(is_active);
CREATE INDEX idx_news_cta_images_cta_id ON public.news_cta_images(news_cta_id);

-- Enable RLS (Row Level Security)
ALTER TABLE public.news_banner ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_cta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_cta_images ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read" ON public.news_banner FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read" ON public.news_announcements FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read" ON public.news_cta FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read" ON public.news_cta_images FOR SELECT USING (true);

-- Create admin write policies (for authenticated users)
CREATE POLICY "Allow all for news banner" ON public.news_banner FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for news announcements" ON public.news_announcements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for news cta" ON public.news_cta FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for news cta images" ON public.news_cta_images FOR ALL USING (true) WITH CHECK (true);

-- Insert default data base on existing content

-- Banner
INSERT INTO public.news_banner (image_url, is_active)
VALUES ('/banner.jpg', true)
ON CONFLICT DO NOTHING;

-- Announcements
INSERT INTO public.news_announcements (title, description, image_url, link_url, "order", is_active)
VALUES 
  ('Bachelor of Science in Nursing', 'Nursing education teaches healing while fostering compassion, resilience, and a strong commitment to serving others.', '/news1.jpg', 'https://www.facebook.com/MandaluyongCST?_rdc=2&_rdr#', 0, true),
  ('Bachelor of Public Administration', 'Mandaluyong College of Science and Technology now offers Public Administration.', '/news2.jpg', 'https://www.facebook.com/MandaluyongCST?_rdc=2&_rdr#', 1, true),
  ('Bachelor of Physical Education', 'Mandaluyong College of Science and Technology now offers Physical Education.', '/news3.jpg', 'https://www.facebook.com/MandaluyongCST?_rdc=2&_rdr#', 2, true)
ON CONFLICT DO NOTHING;

-- CTA
INSERT INTO public.news_cta (title, description, button_text, button_link, is_active)
VALUES 
  (
    'Stay Informed, Stay Inspired', 
    'Discover the latest updates, achievements, and innovations happening at Mandaluyong College of Science and Technology. We bring you stories of impact, community, and the future we''re building together.', 
    'View All News', 
    'https://www.facebook.com/MandaluyongCST?_rdc=2&_rdr#', 
    true
  )
ON CONFLICT DO NOTHING;

-- CTA Images
INSERT INTO public.news_cta_images (news_cta_id, image_url, "order")
SELECT id, '/news1.jpg', 0 FROM public.news_cta WHERE is_active = true
ON CONFLICT DO NOTHING;

INSERT INTO public.news_cta_images (news_cta_id, image_url, "order")
SELECT id, '/campus.png', 1 FROM public.news_cta WHERE is_active = true
ON CONFLICT DO NOTHING;

-- Enable real-time subscriptions for all news tables
-- This allows clients to receive real-time updates when data changes
ALTER PUBLICATION supabase_realtime ADD TABLE public.news_banner;
ALTER PUBLICATION supabase_realtime ADD TABLE public.news_announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE public.news_cta;
ALTER PUBLICATION supabase_realtime ADD TABLE public.news_cta_images;
