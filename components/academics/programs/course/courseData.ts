export interface ProgramCard {
  id: string
  icon: string
  title: string
  description: string
  duration: string
  requiredStrand: string
  backgroundImage?: string
  isNew?: boolean
  status?: 'available' | 'coming-soon'
}

export const PROGRAM_DATA: ProgramCard[] = [
  {
    id: '1',
    icon: 'Megaphone',
    title: 'Bachelor of Arts in Communication',
    description:
      'Develop strong communication skills across various media platforms and prepare for careers in journalism, public relations, broadcasting, and digital media.',
    duration: '4 years',
    requiredStrand: 'All Strands',
    backgroundImage: '/1.webp',
    status: 'available',
  },
  {
    id: '2',
    icon: 'Cpu',
    title: 'Bachelor of Science in Information Systems',
    description:
      'Learn to design, implement, and manage information systems that support business operations and decision-making in the digital age.',
    duration: '4 years',
    requiredStrand: 'STEM, TVL-ICT',
    backgroundImage: '/2.webp',
    status: 'available',
  },
  {
    id: '3',
    icon: 'Sigma',
    title: 'Bachelor of Science in Mathematics',
    description:
      'Build a strong foundation in mathematical theory and applications, preparing for careers in education, research, data analysis, and various STEM fields.',
    duration: '4 years',
    requiredStrand: 'STEM, ABM',
    backgroundImage: '/3.webp',
    status: 'available',
  },
  {
    id: '4',
    icon: 'Building2',
    title: 'Bachelor of Public Administration',
    description:
      'Prepare for leadership roles in government and public service, focusing on policy analysis, public management, and civic engagement.',
    duration: '4 years',
    requiredStrand: 'All Strands',
    isNew: true,
    status: 'coming-soon',
  },
  {
    id: '5',
    icon: 'Activity',
    title: 'Bachelor of Physical Education',
    description:
      'Develop expertise in physical fitness, sports science, and health education to become effective physical education teachers and fitness professionals.',
    duration: '4 years',
    requiredStrand: 'All Strands',
    isNew: true,
    status: 'coming-soon',
  },
  {
    id: '6',
    icon: 'Heart',
    title: 'Bachelor of Science in Nursing',
    description:
      'Gain comprehensive knowledge and practical skills in nursing, preparing for a rewarding career in healthcare, patient care, and community health services.',
    duration: '4 years',
    requiredStrand: 'All Strands',
    isNew: true,
    status: 'coming-soon',
  },
]
