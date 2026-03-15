-- Create ENUM type for course status
CREATE TYPE status_type AS ENUM ('active', 'coming-soon');

-- 1. Hero Section - Programs Page
CREATE TABLE IF NOT EXISTS public.programs_hero_section (
  id BIGSERIAL PRIMARY KEY,
  background_image VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.programs_header (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255),
  sub_title VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Featured Programs Section
CREATE TABLE IF NOT EXISTS public.programs_featured_programs (
  id BIGSERIAL PRIMARY KEY,
  icon VARCHAR(100) NOT NULL,
  course_title VARCHAR(255) NOT NULL,
  course_code VARCHAR(255) NOT NULL,
  course_description VARCHAR(255) NOT NULL,
  course_image VARCHAR(255),
  course_duration VARCHAR(255),
  course_required_strand VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  "order" INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. CTA (Call To Action) Section - Programs Page
CREATE TABLE IF NOT EXISTS public.programs_cta_section (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_programs_hero_section_active ON public.programs_hero_section(is_active);
CREATE INDEX idx_programs_header_active ON public.programs_header(is_active);
CREATE INDEX idx_programs_featured_programs_order ON public.programs_featured_programs("order");
CREATE INDEX idx_programs_featured_programs_active ON public.programs_featured_programs(is_active);
CREATE INDEX idx_programs_cta_section_active ON public.programs_cta_section(is_active);

-- Enable RLS (Row Level Security)
ALTER TABLE public.programs_hero_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs_header ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs_featured_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs_cta_section ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read" ON public.programs_hero_section
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read" ON public.programs_header
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read" ON public.programs_featured_programs
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read" ON public.programs_cta_section
  FOR SELECT USING (is_active = true);
