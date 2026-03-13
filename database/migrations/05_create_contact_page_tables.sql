-- 1. Contact Page Hero Section
CREATE TABLE IF NOT EXISTS public.contact_page_hero (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL DEFAULT 'Let''s Talk. Get in Touch with MCST',
  subtitle VARCHAR(255) DEFAULT 'Whether you are a student, parent, or guest, we are here to help.',
  logo_image VARCHAR(255) DEFAULT '/mcst-logo.png',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Contact Page Info Section
CREATE TABLE IF NOT EXISTS public.contact_page_info (
  id BIGSERIAL PRIMARY KEY,
  section_image VARCHAR(255) DEFAULT '/join2.jpg',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Contact Page Info Items (Address, Phone, Email)
CREATE TABLE IF NOT EXISTS public.contact_page_info_items (
  id BIGSERIAL PRIMARY KEY,
  contact_info_id BIGSERIAL REFERENCES public.contact_page_info(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'address', 'phone', 'email'
  label VARCHAR(255) NOT NULL, -- 'Main Campus', 'Phone', 'Email'
  content TEXT NOT NULL,
  "order" INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_contact_page_hero_active ON public.contact_page_hero(is_active);
CREATE INDEX idx_contact_page_info_active ON public.contact_page_info(is_active);
CREATE INDEX idx_contact_page_info_items_contact_id ON public.contact_page_info_items(contact_info_id);
CREATE INDEX idx_contact_page_info_items_order ON public.contact_page_info_items("order");

-- Enable RLS (Row Level Security)
ALTER TABLE public.contact_page_hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_page_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_page_info_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read" ON public.contact_page_hero
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read" ON public.contact_page_info
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read" ON public.contact_page_info_items
  FOR SELECT USING (true);

-- Create admin write policies (for authenticated users)
CREATE POLICY "Allow all for contact hero" ON public.contact_page_hero
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for contact info" ON public.contact_page_info
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for contact info items" ON public.contact_page_info_items
  FOR ALL USING (true) WITH CHECK (true);

-- Insert default contact page data
INSERT INTO public.contact_page_hero (title, subtitle, logo_image, is_active)
VALUES ('Let''s Talk. Get in Touch with MCST', 'Whether you are a student, parent, or guest, we are here to help.', '/mcst-logo.png', true)
ON CONFLICT DO NOTHING;

INSERT INTO public.contact_page_info (section_image, is_active)
VALUES ('/join2.jpg', true)
ON CONFLICT DO NOTHING;

-- Insert default contact items
INSERT INTO public.contact_page_info_items (contact_info_id, type, label, content, "order")
SELECT id, 'address', 'Main Campus', 'Welfareville Compound, Barangay Addition Hills, Mandaluyong City 1550', 0
FROM public.contact_page_info WHERE is_active = true
ON CONFLICT DO NOTHING;

INSERT INTO public.contact_page_info_items (contact_info_id, type, label, content, "order")
SELECT id, 'phone', 'Phone', '(02) 87160352', 1
FROM public.contact_page_info WHERE is_active = true
ON CONFLICT DO NOTHING;

INSERT INTO public.contact_page_info_items (contact_info_id, type, label, content, "order")
SELECT id, 'email', 'Email', 'registrarsoffice@mcst.edu.ph', 2
FROM public.contact_page_info WHERE is_active = true
ON CONFLICT DO NOTHING;
