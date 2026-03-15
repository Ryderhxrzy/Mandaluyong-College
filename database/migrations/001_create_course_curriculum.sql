-- =====================================================
-- Course Details / Curriculum Management
-- Links to programs_featured_programs via course_id
-- =====================================================

-- Create curriculum years table
CREATE TABLE IF NOT EXISTS curriculum_years (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  order_number INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create curriculum semesters table
CREATE TABLE IF NOT EXISTS curriculum_semesters (
  id BIGSERIAL PRIMARY KEY,
  year_id BIGINT NOT NULL REFERENCES curriculum_years(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  order_number INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(year_id, name)
);

-- Create course curriculum table (linked to featured programs via course_id)
CREATE TABLE IF NOT EXISTS course_curriculum (
  id BIGSERIAL PRIMARY KEY,
  course_id BIGINT NOT NULL REFERENCES public.programs_featured_programs(id) ON DELETE CASCADE,
  semester_id BIGINT NOT NULL REFERENCES curriculum_semesters(id) ON DELETE CASCADE,
  course_code TEXT NOT NULL,
  course_title TEXT NOT NULL,
  units INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(course_id, semester_id, course_code)
);

-- Create course details images table (linked to featured programs via course_id)
CREATE TABLE IF NOT EXISTS course_details_images (
  id BIGSERIAL PRIMARY KEY,
  course_id BIGINT NOT NULL UNIQUE REFERENCES public.programs_featured_programs(id) ON DELETE CASCADE,
  image VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create course possible careers table
CREATE TABLE IF NOT EXISTS course_possible_careers (
  id BIGSERIAL PRIMARY KEY,
  course_id BIGINT NOT NULL REFERENCES public.programs_featured_programs(id) ON DELETE CASCADE,
  career_title TEXT NOT NULL,
  career_description TEXT NOT NULL,
  other_description TEXT,
  order_number INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_curriculum_semesters_year_id ON curriculum_semesters(year_id);
CREATE INDEX IF NOT EXISTS idx_course_curriculum_semester_id ON course_curriculum(semester_id);
CREATE INDEX IF NOT EXISTS idx_course_curriculum_course_id ON course_curriculum(course_id);
CREATE INDEX IF NOT EXISTS idx_course_details_images_course_id ON course_details_images(course_id);
CREATE INDEX IF NOT EXISTS idx_course_possible_careers_course_id ON course_possible_careers(course_id);

-- =====================================================
-- INSERT DEFAULT DATA - CURRICULUM STRUCTURE
-- =====================================================

-- Insert year records
INSERT INTO curriculum_years (name, order_number) VALUES
  ('First Year', 1),
  ('Second Year', 2),
  ('Third Year', 3),
  ('Fourth Year', 4)
ON CONFLICT (name) DO NOTHING;

-- Insert semesters for First Year
INSERT INTO curriculum_semesters (year_id, name, order_number)
SELECT id, 'First Semester', 1 FROM curriculum_years WHERE name = 'First Year'
ON CONFLICT (year_id, name) DO NOTHING;

INSERT INTO curriculum_semesters (year_id, name, order_number)
SELECT id, 'Second Semester', 2 FROM curriculum_years WHERE name = 'First Year'
ON CONFLICT (year_id, name) DO NOTHING;

-- Insert semesters for Second Year
INSERT INTO curriculum_semesters (year_id, name, order_number)
SELECT id, 'First Semester', 1 FROM curriculum_years WHERE name = 'Second Year'
ON CONFLICT (year_id, name) DO NOTHING;

INSERT INTO curriculum_semesters (year_id, name, order_number)
SELECT id, 'Second Semester', 2 FROM curriculum_years WHERE name = 'Second Year'
ON CONFLICT (year_id, name) DO NOTHING;

-- Insert semesters for Third Year
INSERT INTO curriculum_semesters (year_id, name, order_number)
SELECT id, 'First Semester', 1 FROM curriculum_years WHERE name = 'Third Year'
ON CONFLICT (year_id, name) DO NOTHING;

INSERT INTO curriculum_semesters (year_id, name, order_number)
SELECT id, 'Second Semester', 2 FROM curriculum_years WHERE name = 'Third Year'
ON CONFLICT (year_id, name) DO NOTHING;

-- Insert semesters for Fourth Year
INSERT INTO curriculum_semesters (year_id, name, order_number)
SELECT id, 'First Semester', 1 FROM curriculum_years WHERE name = 'Fourth Year'
ON CONFLICT (year_id, name) DO NOTHING;

INSERT INTO curriculum_semesters (year_id, name, order_number)
SELECT id, 'Second Semester', 2 FROM curriculum_years WHERE name = 'Fourth Year'
ON CONFLICT (year_id, name) DO NOTHING;

INSERT INTO curriculum_semesters (year_id, name, order_number)
SELECT id, 'Summer', 3 FROM curriculum_years WHERE name = 'Fourth Year'
ON CONFLICT (year_id, name) DO NOTHING;

-- =====================================================
-- SAMPLE DATA: Bachelor of Arts in Communication (course_id = 1)
-- =====================================================

-- =====================================================
-- FIRST YEAR COURSES
-- =====================================================
-- First Year, First Semester
INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'GELF111', 'Purposive Communication', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'First Year') AND name = 'First Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'GESS111', 'Understanding the Self', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'First Year') AND name = 'First Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'GEPH111', 'Readings in Philippine History', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'First Year') AND name = 'First Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'GEMT111', 'Mathematics in the Modern World', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'First Year') AND name = 'First Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'CCBA125', 'Introduction to Communication Media', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'First Year') AND name = 'First Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'NSTP111', 'CWTS 1', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'First Year') AND name = 'First Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'PEHF111', 'PATHFIT I', 2
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'First Year') AND name = 'First Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'IRMC111', 'Mandaluyong Culture and History', 1
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'First Year') AND name = 'First Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

-- First Year, Second Semester
INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'GEHH002', 'Art Appreciation', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'First Year') AND name = 'Second Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'GEST121', 'Science, Technology, and Society', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'First Year') AND name = 'Second Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'GEHH003', 'Ethics', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'First Year') AND name = 'Second Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'GEST003', 'The Contemporary World', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'First Year') AND name = 'Second Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'CCBA213', 'Communication Culture and Society', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'First Year') AND name = 'Second Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'NSTP122', 'CWTS 2', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'First Year') AND name = 'Second Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'PEHF122', 'PATHFIT II', 2
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'First Year') AND name = 'Second Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

-- =====================================================
-- SECOND YEAR COURSES
-- =====================================================
-- Second Year, First Semester
INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'GESS002', 'Gender & Society', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'Second Year') AND name = 'First Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'GEHH001', 'Philippine Popular Culture', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'Second Year') AND name = 'First Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'CCBA213-DEV', 'Development Communication', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'Second Year') AND name = 'First Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'ELBA214', 'Introduction to Theater Arts', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'Second Year') AND name = 'First Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'ELBA215', 'Speech and Drama', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'Second Year') AND name = 'First Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'GELH001', 'Kontekswalidong Komunikasyon sa Filipino', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'Second Year') AND name = 'First Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'PEHF213', 'PATHFIT3: Dance', 2
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'Second Year') AND name = 'First Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

-- Second Year, Second Semester
INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'GEMT222', 'Elementary Statistics', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'Second Year') AND name = 'Second Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'GESCO01', 'Life and Works of Rizal', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'Second Year') AND name = 'Second Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'CCBA223', 'Communication Theory', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'Second Year') AND name = 'Second Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'RCBA224', 'Risk Disaster and Humanitarian Communication', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'Second Year') AND name = 'Second Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'RCBA225', 'Introduction to Film', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'Second Year') AND name = 'Second Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'GELH002', 'Panitikang Panlipunan', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'Second Year') AND name = 'Second Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'PEHF224', 'PATHFIT4- Team Sports', 2
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'Second Year') AND name = 'Second Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

-- =====================================================
-- THIRD YEAR COURSES
-- =====================================================
-- Third Year, First Semester
INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'CCBA311', 'Communication Research', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'Third Year') AND name = 'First Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'RCBA313', 'Advertising Principles and Practices', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'Third Year') AND name = 'First Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'ELBA314', 'Game Development', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'Third Year') AND name = 'First Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'ELBA315', 'Theater Production', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'Third Year') AND name = 'First Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'ELBA316', 'Multimedia Arts', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'Third Year') AND name = 'First Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

-- Third Year, Second Semester
INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'CCBA321', 'Communication Media Laws and Ethics', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'Third Year') AND name = 'Second Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'ELBA322', 'Digital Imaging', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'Third Year') AND name = 'Second Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'ELBA323', 'Performance Media', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'Third Year') AND name = 'Second Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'ELBA324', 'Creative Writing', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'Third Year') AND name = 'Second Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'ELBA325', 'Cross-Cultural Communication', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'Third Year') AND name = 'Second Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

-- =====================================================
-- FOURTH YEAR COURSES
-- =====================================================
-- Fourth Year, First Semester
INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'ELBA411', 'Thesis 1', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'Fourth Year') AND name = 'First Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'CCBA412', 'Communication Planning', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'Fourth Year') AND name = 'First Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'ELBA413', 'Organizational Culture', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'Fourth Year') AND name = 'First Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'RCBA414', 'Journalism Principles', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'Fourth Year') AND name = 'First Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'IRMCO02', 'Peace Education and Indigenous People''s Culture', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'Fourth Year') AND name = 'First Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

-- Fourth Year, Second Semester
INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'ELBA421', 'Thesis 2', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'Fourth Year') AND name = 'Second Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'CCBA422', 'Communication Management', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'Fourth Year') AND name = 'Second Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'RCBA433', 'Knowledge Management', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'Fourth Year') AND name = 'Second Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'GECD000', 'Community Development', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'Fourth Year') AND name = 'Second Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'CCBA444', 'Strategic Communication', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'Fourth Year') AND name = 'Second Semester'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

-- Fourth Year, Summer
INSERT INTO course_curriculum (course_id, semester_id, course_code, course_title, units)
SELECT 1, id, 'INTERNSHIP', 'INTERNSHIP (300 hrs.)', 3
FROM curriculum_semesters WHERE year_id = (SELECT id FROM curriculum_years WHERE name = 'Fourth Year') AND name = 'Summer'
ON CONFLICT (course_id, semester_id, course_code) DO NOTHING;

-- =====================================================
-- COURSE DETAILS IMAGES
-- =====================================================
INSERT INTO course_details_images (course_id, image)
VALUES (1, '/1.webp')
ON CONFLICT (course_id) DO NOTHING;

-- =====================================================
-- POSSIBLE CAREERS
-- =====================================================
INSERT INTO course_possible_careers (course_id, career_title, career_description, order_number)
VALUES
  (1, 'Public Relations Specialist', 'Develop and maintain a positive public image for organizations, craft media releases, and coordinate public events to increase brand awareness.', 1),
  (1, 'Media Producer / Broadcaster', 'Work in television, radio, or digital platforms to produce engaging content, deliver news, and entertain or inform diverse audiences.', 2),
  (1, 'Corporate Communications Officer', 'Serve as the voice of a company, managing internal and external messaging, crisis communication, and brand consistency.', 3),
  (1, 'Content Creator / Social Media Manager', 'Strategize and create content across platforms, build online communities, and track engagement to enhance digital presence.', 4),
  (1, 'Advertising & Marketing Executive', 'Combine creative and strategic thinking to promote products, services, or ideas across various media channels.', 5),
  (1, 'Writer / Editor / Journalist', 'Research, write, and edit stories for print, broadcast, or online media. Help shape public opinion and inform society.', 6);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE curriculum_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_curriculum ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_details_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_possible_careers ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- curriculum_years Policies
-- =====================================================
-- Public: Read access for all users
CREATE POLICY curriculum_years_select ON curriculum_years
  FOR SELECT
  USING (true);

-- =====================================================
-- curriculum_semesters Policies
-- =====================================================
-- Public: Read access for all users
CREATE POLICY curriculum_semesters_select ON curriculum_semesters
  FOR SELECT
  USING (true);


-- =====================================================
-- course_curriculum Policies
-- =====================================================
-- Public: Read access for all users
CREATE POLICY course_curriculum_select ON course_curriculum
  FOR SELECT
  USING (true);


-- =====================================================
-- course_details_images Policies
-- =====================================================
-- Public: Read access for all users
CREATE POLICY course_details_images_select ON course_details_images
  FOR SELECT
  USING (true);

-- =====================================================
-- course_possible_careers Policies
-- =====================================================
-- Public: Read access for all users
CREATE POLICY course_possible_careers_select ON course_possible_careers
  FOR SELECT
  USING (true);
