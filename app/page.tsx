import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { OverviewItem } from '@/components/InstitutionalOverview'
import RealtimeHomeWrapper from '@/components/RealtimeHomeWrapper'

interface HeroData {
  id: string
  title: string
  subtitle: string
  description: string
  background_image_url: string
  is_active: boolean
}

interface CoreValuesData {
  id: string
  title: string
  description: string
  background_image_url: string
  is_active: boolean
}

interface ProgramData {
  id: number
  title: string
  image: string | null
  order: number
  is_active: boolean
  course_name?: string
}

interface CommitmentData {
  title: string
  subtitle: string
  items: any[]
}

async function getHeroData(): Promise<HeroData | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const response = await fetch(
      `${apiUrl}/api/admin/home/hero/save`,
      { cache: 'no-store' }
    )
    const data = await response.json()
    return data.data || null
  } catch (error) {
    console.error('Error fetching hero data:', error)
    return null
  }
}

async function getCoreValuesData(): Promise<CoreValuesData | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const response = await fetch(
      `${apiUrl}/api/admin/home/core-values`,
      { cache: 'no-store' }
    )
    const data = await response.json()
    return data.data || null
  } catch (error) {
    console.error('Error fetching core values data:', error)
    return null
  }
}

async function getOverviewData(): Promise<{ title: string, items: OverviewItem[] } | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const response = await fetch(
      `${apiUrl}/api/admin/home/overview`,
      { cache: 'no-store' }
    )
    const data = await response.json()
    if (data && data.length > 0) {
      return {
        title: data[0].title,
        items: data.filter((item: any) => item.is_active).map((item: any) => ({
          id: String(item.id),
          icon: item.icon,
          value: item.value,
          label: item.icon_title,
          color: item.icon_color,
          bgColorLight: item.icon_bg_color_light,
          bgColorDark: item.icon_bg_color_dark
        }))
      }
    }
    return null
  } catch (error) {
    console.error('Error fetching overview data:', error)
    return null
  }
}

async function getAcademicProgramsData(): Promise<ProgramData[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const response = await fetch(`${apiUrl}/api/admin/home/academic-programs`, {
      cache: 'no-store',
    })
    if (response.ok) {
      return await response.json()
    }
    return []
  } catch (error) {
    console.error('Error fetching academic programs:', error)
    return []
  }
}

async function getEducationCommitmentData(): Promise<CommitmentData | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const response = await fetch(`${apiUrl}/api/admin/home/education-commitment`, {
      cache: 'no-store',
    })
    if (response.ok) {
      const data = await response.json()
      if (data && data.length > 0) {
        return {
          title: data[0].title || "Our Commitment to Quality Education and Innovation",
          subtitle: data[0].description || "At Mandaluyong College of Science and Technology, we strive to provide accessible, high-quality education that empowers our students. Our dedication to advancing instruction and research ensures that we remain at the forefront of academic excellence.",
          items: data.filter((item: any) => item.is_active)
        }
      }
    }
    return null
  } catch (error) {
    console.error('Error fetching education commitment:', error)
    return null
  }
}

export default async function Home() {
  const heroData = await getHeroData()
  const coreValuesData = await getCoreValuesData()
  const overviewData = await getOverviewData()
  const academicProgramsData = await getAcademicProgramsData()
  const educationCommitmentData = await getEducationCommitmentData()

  const defaultHero: HeroData = {
    id: '1',
    title: 'Shaping Tomorrow\'s Innovators at',
    subtitle: 'Mandaluyong College of Science and Technology',
    description:
      'Discover a future built on innovation and excellence. Our programs in Information Systems, Mathematics, Communication, Public Administration, and Physical Education equip students with the skills and mindset to thrive in a technology-driven world.',
    background_image_url: '/mcst.jpg',
    is_active: true,
  }

  const defaultCoreValues: CoreValuesData = {
    id: '1',
    title: 'Core Values That Drive Excellence at Mandaluyong College of Science and Technology',
    description:
      'At MCST, we are committed to genuine public service and fostering care within our community. Our core values of discipline, action over words, nationalism, and excellence guide us in shaping responsible and innovative leaders.',
    background_image_url: '/campus.png',
    is_active: true,
  }

  const hero = heroData || defaultHero
  const coreValues = coreValuesData || defaultCoreValues
  const overview = overviewData || {
    title: "Our Commitment to Academic Excellence",
    items: [
      {
        id: '1',
        icon: 'Users',
        value: '420+',
        label: 'Students Enrolled',
        color: '#003a7a',
        bgColorLight: '#ebf2fa',
        bgColorDark: '#1e293b',
      },
      {
        id: '2',
        icon: 'Award',
        value: '20+',
        label: 'Faculty Members',
        color: '#16a34a',
        bgColorLight: '#f0fdf4',
        bgColorDark: '#14532d',
      },
      {
        id: '3',
        icon: 'BookOpen',
        value: '5',
        label: 'Degree Programs',
        color: '#9333ea',
        bgColorLight: '#faf5ff',
        bgColorDark: '#581c87',
      },
      {
        id: '4',
        icon: 'Target',
        value: '100%',
        label: 'Commitment to Excellence',
        color: '#f59e0b',
        bgColorLight: '#fffbeb',
        bgColorDark: '#78350f',
      },
    ]
  }

  return (
    <RealtimeHomeWrapper
      initialHero={hero}
      initialCoreValues={coreValues}
      initialOverview={overview}
      initialPrograms={academicProgramsData}
      initialCommitment={educationCommitmentData}
    />
  )
}
