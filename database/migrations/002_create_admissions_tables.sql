-- Admissions Qualifications Table
CREATE TABLE IF NOT EXISTS public.admissions_qualifications (
  id SERIAL PRIMARY KEY,
  qualification_text TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.admissions_qualifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to active qualifications" ON public.admissions_qualifications
  FOR SELECT
  USING (is_active = true);

-- Admissions Required Strands Table
CREATE TABLE IF NOT EXISTS public.admissions_required_strands (
  id SERIAL PRIMARY KEY,
  program TEXT NOT NULL,
  strand_requirement TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.admissions_required_strands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to active strands" ON public.admissions_required_strands
  FOR SELECT
  USING (is_active = true);

-- Documentary Requirements Table
CREATE TABLE IF NOT EXISTS public.admissions_documentary_requirements (
  id SERIAL PRIMARY KEY,
  requirement_text TEXT NOT NULL,
  requirement_type VARCHAR(50) DEFAULT 'main',
  parent_requirement_id INTEGER REFERENCES admissions_documentary_requirements(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.admissions_documentary_requirements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to active requirements" ON public.admissions_documentary_requirements
  FOR SELECT
  USING (is_active = true);

-- Admission Procedures Table
CREATE TABLE IF NOT EXISTS public.admissions_admission_procedures (
  id SERIAL PRIMARY KEY,
  step_number INTEGER NOT NULL,
  step_title TEXT NOT NULL,
  step_description TEXT,
  additional_info TEXT,
  link_text VARCHAR(255),
  link_url TEXT,
  note_text TEXT,
  note_type VARCHAR(50),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.admissions_admission_procedures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to active procedures" ON public.admissions_admission_procedures
  FOR SELECT
  USING (is_active = true);

-- Admission Goals Table
CREATE TABLE IF NOT EXISTS public.admissions_goals (
  id SERIAL PRIMARY KEY,
  goal_text TEXT NOT NULL,
  icon_name VARCHAR(50),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.admissions_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to active goals" ON public.admissions_goals
  FOR SELECT
  USING (is_active = true);

-- Admissions Banner Settings Table
CREATE TABLE IF NOT EXISTS public.admissions_banner_settings (
  id SERIAL PRIMARY KEY,
  section_name VARCHAR(255) NOT NULL UNIQUE,
  banner_image_url TEXT,
  title TEXT,
  subtitle TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.admissions_banner_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to active banner settings" ON public.admissions_banner_settings
  FOR SELECT
  USING (is_active = true);

-- Insert sample data for Admissions Qualifications
INSERT INTO public.admissions_qualifications (qualification_text, order_index)
VALUES
  ('A Certified Resident of Mandaluyong', 1),
  ('Academic Excellence with a Minimum 85.00% General Weighted Average (GWA)', 2),
  ('Senior High School Graduates, Ongoing/Graduating Grade 12 Students, and Graduates of the Old Curriculum', 3),
  ('Applicants who have taken college units may be considered; however, no units taken previously shall be credited except NSTP, and TOR shall be validated', 4)
ON CONFLICT DO NOTHING;

-- Insert sample data for Admissions Required Strands
INSERT INTO public.admissions_required_strands (program, strand_requirement, order_index)
VALUES
  ('Bachelor of Science in Mathematics', 'STEM, ABM', 1),
  ('Bachelor of Arts in Communication', 'All Strands', 2),
  ('Bachelor of Science in Information Systems', 'STEM, TVL-ICT', 3),
  ('Bachelor of Public Administration', 'All Strands', 4),
  ('Bachelor of Physical Education', 'All Strands', 5),
  ('Bachelor of Science in Nursing', 'All Strands', 6)
ON CONFLICT DO NOTHING;

-- Insert sample data for Documentary Requirements
INSERT INTO public.admissions_documentary_requirements (requirement_text, requirement_type, order_index)
VALUES
  ('Completely filled out Application Form', 'main', 1),
  ('Form 138 (For ongoing Grade 12 SHS)', 'main', 2),
  ('Certificate of Good Moral Character', 'main', 3),
  ('PSA Birth Certificate', 'main', 4),
  ('Proof of Mandaluyong Residence (any ONE of the following):', 'main', 5)
ON CONFLICT DO NOTHING;

-- Insert sub-requirements for Proof of Mandaluyong Residence
INSERT INTO public.admissions_documentary_requirements (requirement_text, requirement_type, parent_requirement_id, order_index)
SELECT 'Voter''s ID of the applicant or their parents', 'sub', id, 1
FROM public.admissions_documentary_requirements
WHERE requirement_text = 'Proof of Mandaluyong Residence (any ONE of the following):'
ON CONFLICT DO NOTHING;

INSERT INTO public.admissions_documentary_requirements (requirement_text, requirement_type, parent_requirement_id, order_index)
SELECT 'Any government-issued ID of the student, parent/s, or legal guardian showing address in Mandaluyong City', 'sub', id, 2
FROM public.admissions_documentary_requirements
WHERE requirement_text = 'Proof of Mandaluyong Residence (any ONE of the following):'
ON CONFLICT DO NOTHING;

INSERT INTO public.admissions_documentary_requirements (requirement_text, requirement_type, parent_requirement_id, order_index)
SELECT 'Proof of billing with Mandaluyong address named after the student or their parent/s or guardian', 'sub', id, 3
FROM public.admissions_documentary_requirements
WHERE requirement_text = 'Proof of Mandaluyong Residence (any ONE of the following):'
ON CONFLICT DO NOTHING;

-- Continue with other main requirements
INSERT INTO public.admissions_documentary_requirements (requirement_text, requirement_type, order_index)
VALUES
  ('Two (2) completely filled-out Recommendation Forms by former teacher/s or the School Principal, in a sealed envelope.', 'main', 6),
  ('Original & photocopy of Certificate of Rating (ALS Completer/Passer only)', 'main', 7),
  ('Transcript of Records (TOR) with graduation date (For Associate, Certificate, Vocational, or Diploma Degree Holder)', 'main', 8)
ON CONFLICT DO NOTHING;

-- Insert sample data for Admission Procedures
INSERT INTO public.admissions_admission_procedures (
  step_number,
  step_title,
  step_description,
  link_text,
  link_url,
  note_text,
  note_type,
  order_index
)
VALUES
  (
    1,
    'Fill out the pre-registration via Google Form',
    NULL,
    'Pre-Register Form',
    'https://docs.google.com/forms/d/e/1FAIpQLSc1wetVpXWkg_4nUZQeWjlHGJ2zDxdXGrNcmJrGj0EXmUtadw/viewform',
    'Failure to take the pre-registration form means invalid application.',
    'error',
    1
  ),
  (
    2,
    'Submit required documents',
    'Submit required documents in person at the Registrar''s Office (Ground Floor, Administrative Building) starting February 17, 2025',
    NULL,
    NULL,
    'Only walk-ins with complete requirements will be accommodated. Submission hours: 8:00 AM – 4:00 PM (Mon-Fri)',
    'warning',
    2
  ),
  (
    3,
    'All requirements will be assessed by the Admission Officer',
    'Once complete, the student will be scheduled for the Entrance Examination.',
    NULL,
    NULL,
    NULL,
    'info',
    3
  )
ON CONFLICT DO NOTHING;

-- Insert sample data for Admission Goals
INSERT INTO public.admissions_goals (goal_text, icon_name, order_index)
VALUES
  ('Provide Mandaluyong access to quality higher education.', 'BookOpen', 1),
  ('Support optimum advancement in instruction, technology, research, innovation, and resource generation.', 'TrendingUp', 2),
  ('Collaborate with various educational, technical, and professional stakeholders for genuine public service.', 'Users', 3),
  ('Foster institutional effectiveness and efficiency for continuous improvement and total quality management.', 'Zap', 4),
  ('Produce graduates who are locally and internationally competent with a high sense of nationalism.', 'Globe', 5)
ON CONFLICT DO NOTHING;

-- Insert sample data for Admissions Banner Settings
INSERT INTO public.admissions_banner_settings (section_name, banner_image_url, title, subtitle)
VALUES
  ('admissions_main', '/banner.jpg', 'Admissions', 'Join Mandaluyong College of Science and Technology')
ON CONFLICT DO NOTHING;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_admissions_qualifications_active ON public.admissions_qualifications(is_active);
CREATE INDEX IF NOT EXISTS idx_admissions_required_strands_active ON public.admissions_required_strands(is_active);
CREATE INDEX IF NOT EXISTS idx_admissions_documentary_requirements_active ON public.admissions_documentary_requirements(is_active);
CREATE INDEX IF NOT EXISTS idx_admissions_admission_procedures_active ON public.admissions_admission_procedures(is_active);
CREATE INDEX IF NOT EXISTS idx_admissions_goals_active ON public.admissions_goals(is_active);

-- Enable real-time subscriptions for all admissions tables
-- This allows clients to receive real-time updates when data changes
ALTER PUBLICATION supabase_realtime ADD TABLE public.admissions_qualifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.admissions_required_strands;
ALTER PUBLICATION supabase_realtime ADD TABLE public.admissions_documentary_requirements;
ALTER PUBLICATION supabase_realtime ADD TABLE public.admissions_admission_procedures;
ALTER PUBLICATION supabase_realtime ADD TABLE public.admissions_goals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.admissions_banner_settings;
