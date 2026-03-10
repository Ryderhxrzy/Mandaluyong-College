-- 1. Hero Section
CREATE TABLE IF NOT EXISTS public.hero_section_home_page (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  background_image VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Institutional Overview (420+ Students, 20+ Faculty, etc.)
CREATE TABLE IF NOT EXISTS public.institutional_overview_home_page (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  icon VARCHAR(100) NOT NULL,
  icon_color VARCHAR(50),
  icon_bg_color_light VARCHAR(50),
  icon_bg_color_dark VARCHAR(50),
  icon_title VARCHAR(255) NOT NULL,
  icon_title_color VARCHAR(50),
  value VARCHAR(50),
  "order" INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Core Values Section
CREATE TABLE IF NOT EXISTS public.core_values_home_page (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  background_image VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Quality Education and Innovation Commitment (3-card section)
CREATE TABLE IF NOT EXISTS public.quality_education_commitment_home_page (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(100) NOT NULL,
  icon_color VARCHAR(50),
  icon_bg_color_light VARCHAR(50),
  icon_bg_color_dark VARCHAR(50),
  icon_title VARCHAR(255) NOT NULL,
  icon_title_color VARCHAR(50),
  value VARCHAR(255),
  "order" INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Academic Programs (Carousel)
CREATE TABLE IF NOT EXISTS public.academic_programs_home_page (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image VARCHAR(255),
  "order" INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. CTA (Call To Action) Section
CREATE TABLE IF NOT EXISTS public.cta_section_home_page (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_hero_section_home_page_active ON public.hero_section_home_page(is_active);
CREATE INDEX idx_institutional_overview_home_page_order ON public.institutional_overview_home_page("order");
CREATE INDEX idx_institutional_overview_home_page_active ON public.institutional_overview_home_page(is_active);
CREATE INDEX idx_core_values_home_page_active ON public.core_values_home_page(is_active);
CREATE INDEX idx_quality_education_home_page_order ON public.quality_education_commitment_home_page("order");
CREATE INDEX idx_quality_education_home_page_active ON public.quality_education_commitment_home_page(is_active);
CREATE INDEX idx_academic_programs_home_page_order ON public.academic_programs_home_page("order");
CREATE INDEX idx_academic_programs_home_page_active ON public.academic_programs_home_page(is_active);
CREATE INDEX idx_cta_section_home_page_active ON public.cta_section_home_page(is_active);

-- Enable RLS (Row Level Security)
ALTER TABLE public.hero_section_home_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutional_overview_home_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.core_values_home_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_education_commitment_home_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_programs_home_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cta_section_home_page ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read" ON public.hero_section_home_page
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read" ON public.institutional_overview_home_page
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read" ON public.core_values_home_page
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read" ON public.quality_education_commitment_home_page
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read" ON public.academic_programs_home_page
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read" ON public.cta_section_home_page
  FOR SELECT USING (is_active = true);
