-- 1. FAQs Hero
CREATE TABLE IF NOT EXISTS public.faqs_hero (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) DEFAULT 'Have Questions?',
  subtitle VARCHAR(255) DEFAULT 'We Have Answers.',
  description TEXT DEFAULT 'Everything you need to know about Mandaluyong College of Science and Technology.',
  icon VARCHAR(50) DEFAULT 'HelpCircle',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. FAQs Sections (Categories)
CREATE TABLE IF NOT EXISTS public.faqs_sections (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  "order" INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. FAQs Items
CREATE TABLE IF NOT EXISTS public.faqs_items (
  id BIGSERIAL PRIMARY KEY,
  section_id BIGINT REFERENCES public.faqs_sections(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  "order" INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Privacy Policy Hero
CREATE TABLE IF NOT EXISTS public.privacy_policy_hero (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) DEFAULT 'Your Privacy',
  subtitle VARCHAR(255) DEFAULT 'Our Commitment',
  description TEXT DEFAULT 'How we protect and use your information at Mandaluyong College of Science and Technology',
  icon VARCHAR(50) DEFAULT 'ShieldCheck',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Privacy Policy Sections
CREATE TABLE IF NOT EXISTS public.privacy_policy_sections (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  "order" INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Terms and Conditions Hero
CREATE TABLE IF NOT EXISTS public.terms_and_conditions_hero (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) DEFAULT 'Terms & Conditions',
  subtitle VARCHAR(255) DEFAULT 'Your Rights and Obligations',
  description TEXT DEFAULT 'Know what you''re agreeing to when using Mandaluyong College of Science and Technology platforms.',
  icon VARCHAR(50) DEFAULT 'Handshake',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Terms and Conditions Sections
CREATE TABLE IF NOT EXISTS public.terms_and_conditions_sections (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  "order" INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.faqs_hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privacy_policy_hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privacy_policy_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.terms_and_conditions_hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.terms_and_conditions_sections ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read" ON public.faqs_hero FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read" ON public.faqs_sections FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read" ON public.faqs_items FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read" ON public.privacy_policy_hero FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read" ON public.privacy_policy_sections FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read" ON public.terms_and_conditions_hero FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read" ON public.terms_and_conditions_sections FOR SELECT USING (is_active = true);

-- Create admin write policies
CREATE POLICY "Allow all for faqs_hero" ON public.faqs_hero FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for faqs_sections" ON public.faqs_sections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for faqs_items" ON public.faqs_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for privacy_policy_hero" ON public.privacy_policy_hero FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for privacy_policy_sections" ON public.privacy_policy_sections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for terms_and_conditions_hero" ON public.terms_and_conditions_hero FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for terms_and_conditions_sections" ON public.terms_and_conditions_sections FOR ALL USING (true) WITH CHECK (true);

-- Insert Default Data

-- FAQs Hero
INSERT INTO public.faqs_hero (title, subtitle, description, icon)
VALUES ('Have Questions?', 'We Have Answers.', 'Everything you need to know about Mandaluyong College of Science and Technology.', 'HelpCircle')
ON CONFLICT DO NOTHING;

-- FAQs Sections
INSERT INTO public.faqs_sections (title, "order")
VALUES ('Admission & Programs', 0)
ON CONFLICT DO NOTHING;

-- FAQs Items
INSERT INTO public.faqs_items (section_id, question, answer, "order")
SELECT id, 'What programs are offered?', 'Mandaluyong College of Science and Technology offers a diverse range of programs. These include Bachelor of Arts in Communication, Bachelor of Science in Information Systems, and Bachelor of Science in Mathematics.', 0 FROM public.faqs_sections WHERE title = 'Admission & Programs'
UNION ALL
SELECT id, 'If I am a graduate of the old curriculum, and not of K-12, can I be accepted?', 'According to CHED Memorandum 10 s. 2017, you can be accepted but you will undergo a bridging program to catch up on the subjects you should have taken at the SHS (Senior High School) level.', 1 FROM public.faqs_sections WHERE title = 'Admission & Programs'
UNION ALL
SELECT id, 'Will I be accepted if my final average is 84 or lower?', 'Based on the signed Board Resolution 008 s. 2023 of MCST, only students with a final average of 85 or higher can be accepted for the first year of operation.', 2 FROM public.faqs_sections WHERE title = 'Admission & Programs';

-- Privacy Hero
INSERT INTO public.privacy_policy_hero (title, subtitle, description, icon)
VALUES ('Your Privacy', 'Our Commitment', 'How we protect and use your information at Mandaluyong College of Science and Technology', 'ShieldCheck')
ON CONFLICT DO NOTHING;

-- Privacy Sections
INSERT INTO public.privacy_policy_sections (content, "order")
VALUES 
  ('At Mandaluyong College of Science and Technology, we are committed to protecting your privacy and ensuring the security of any personal information you provide through our website. When you interact with us—such as enrolling, submitting forms, or reaching out—we may collect personal details including your name, email, contact number, and academic preferences.', 0),
  ('We also collect technical data such as your IP address, browser type, and behavior patterns using cookies to help improve our user experience and online services. This data is used to process requests, respond to inquiries, enhance academic services, and occasionally notify you of school events and updates (if you opted in).', 1),
  ('MCST implements strict security measures to safeguard your personal information. We do not sell or disclose your data to third parties, except trusted partners and systems essential for educational and operational functions, all under strict confidentiality.', 2),
  ('You have the right to access, modify, or request deletion of your information at any time by contacting our administrative office. Our website may contain links to other educational or government sites, and we are not responsible for their privacy practices.', 3),
  ('By continuing to use our services, you agree to the terms of this policy. We reserve the right to update this policy to reflect current practices and compliance requirements. Updates will be posted on this page.', 4),
  ('For any concerns regarding your data, please contact us at: (02) 87160352 or email: registrarsoffice@mcst.edu.ph.', 5)
ON CONFLICT DO NOTHING;

-- Terms Hero
INSERT INTO public.terms_and_conditions_hero (title, subtitle, description, icon)
VALUES ('Terms & Conditions', 'Your Rights and Obligations', 'Know what you''re agreeing to when using Mandaluyong College of Science and Technology platforms.', 'Handshake')
ON CONFLICT DO NOTHING;

-- Terms Sections
INSERT INTO public.terms_and_conditions_sections (content, "order")
VALUES 
  ('By accessing or using the official website of Mandaluyong College of Science and Technology, you agree to comply with and be bound by these terms and conditions. Please read them carefully before using our services.', 0),
  ('All content, graphics, and materials on this website are the intellectual property of Mandaluyong College of Science and Technology and are protected by applicable copyright laws. You may not reproduce, modify, distribute, or republish content without prior written permission.', 1),
  ('The university reserves the right to change, suspend, or discontinue any aspect of the website at any time without notice. We may also modify these terms at any time and your continued use constitutes acceptance of those changes.', 2),
  ('Users must not misuse this website. Engaging in illegal activities, unauthorized access, or transmitting harmful software is strictly prohibited.', 3),
  ('While we strive to maintain accurate and updated information, Mandaluyong College of Science and Technology does not guarantee completeness or accuracy. We are not liable for any loss or damage arising from your reliance on the content.', 4),
  ('These terms are governed by Philippine law. Any disputes arising in connection with the use of this website shall be subject to the exclusive jurisdiction of the Philippine courts.', 5),
  ('If you have questions about our terms, please reach out at: registrarsoffice@mcst.edu.ph.', 6)
ON CONFLICT DO NOTHING;

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE public.faqs_hero;
ALTER PUBLICATION supabase_realtime ADD TABLE public.faqs_sections;
ALTER PUBLICATION supabase_realtime ADD TABLE public.faqs_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.privacy_policy_hero;
ALTER PUBLICATION supabase_realtime ADD TABLE public.privacy_policy_sections;
ALTER PUBLICATION supabase_realtime ADD TABLE public.terms_and_conditions_hero;
ALTER PUBLICATION supabase_realtime ADD TABLE public.terms_and_conditions_sections;
