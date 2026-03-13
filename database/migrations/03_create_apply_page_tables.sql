-- 1. Apply Page Hero Section
CREATE TABLE IF NOT EXISTS public.apply_page_hero_section (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  logo_image VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Apply Main Page Section
CREATE TABLE IF NOT EXISTS public.apply_page (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  enrollment_period VARCHAR(255),
  enrollment_dates VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Apply Page Requirements Table
CREATE TABLE IF NOT EXISTS public.apply_page_requirements (
  id BIGSERIAL PRIMARY KEY,
  apply_page_id BIGSERIAL REFERENCES public.apply_page(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  "order" INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Apply Page Enrollment Procedure Table
CREATE TABLE IF NOT EXISTS public.apply_page_enrollment_procedure (
  id BIGSERIAL PRIMARY KEY,
  apply_page_id BIGSERIAL REFERENCES public.apply_page(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  description TEXT NOT NULL,
  "order" INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Apply Page Enrollment Schedule Section (Header/Metadata)
CREATE TABLE IF NOT EXISTS public.apply_page_enrollment_schedule (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Apply Page Enrollment Schedule Items
CREATE TABLE IF NOT EXISTS public.apply_page_enrollment_schedule_items (
  id BIGSERIAL PRIMARY KEY,
  schedule_id BIGSERIAL REFERENCES public.apply_page_enrollment_schedule(id) ON DELETE CASCADE,
  date VARCHAR(255) NOT NULL,
  time VARCHAR(255) NOT NULL,
  year_level VARCHAR(255) NOT NULL,
  section VARCHAR(255),
  "order" INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_apply_page_hero_section_active ON public.apply_page_hero_section(is_active);
CREATE INDEX idx_apply_page_active ON public.apply_page(is_active);
CREATE INDEX idx_apply_page_requirements_order ON public.apply_page_requirements("order");
CREATE INDEX idx_apply_page_enrollment_procedure_order ON public.apply_page_enrollment_procedure("order");
CREATE INDEX idx_apply_page_enrollment_schedule_active ON public.apply_page_enrollment_schedule(is_active);
CREATE INDEX idx_apply_page_enrollment_schedule_items_schedule_id ON public.apply_page_enrollment_schedule_items(schedule_id);
CREATE INDEX idx_apply_page_enrollment_schedule_items_order ON public.apply_page_enrollment_schedule_items("order");

-- Enable RLS (Row Level Security)
ALTER TABLE public.apply_page_hero_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apply_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apply_page_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apply_page_enrollment_procedure ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apply_page_enrollment_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apply_page_enrollment_schedule_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read" ON public.apply_page_hero_section
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read" ON public.apply_page
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read" ON public.apply_page_requirements
  FOR SELECT USING (true);

CREATE POLICY "Allow public read" ON public.apply_page_enrollment_procedure
  FOR SELECT USING (true);

CREATE POLICY "Allow public read" ON public.apply_page_enrollment_schedule
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read" ON public.apply_page_enrollment_schedule_items
  FOR SELECT USING (true);

-- Create admin write policies (for authenticated users)
CREATE POLICY "Allow authenticated update" ON public.apply_page_enrollment_schedule
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert" ON public.apply_page_enrollment_schedule
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update items" ON public.apply_page_enrollment_schedule_items
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert items" ON public.apply_page_enrollment_schedule_items
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete items" ON public.apply_page_enrollment_schedule_items
  FOR DELETE USING (auth.role() = 'authenticated');

-- Insert default enrollment schedule data
INSERT INTO public.apply_page_enrollment_schedule (title, subtitle, is_active)
VALUES ('Enrollment Schedule', 'A.Y. 2025–2026 (1st Semester)', true)
ON CONFLICT DO NOTHING;
