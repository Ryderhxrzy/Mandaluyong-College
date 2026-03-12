import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ProgramsCarousel from '@/components/ProgramsCarousel'
import InstitutionalOverview, { OverviewItem } from '@/components/InstitutionalOverview'
import Hero from '@/components/Hero'

const overviewItems: OverviewItem[] = [
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

export default async function Home() {
  const heroData = await getHeroData()
  const coreValuesData = await getCoreValuesData()
  const overviewData = await getOverviewData()

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
  const overview = overviewData || { title: "Our Commitment to Academic Excellence", items: overviewItems }

  return (
    <>
      {/* Hero Section */}
      <Hero
        title={hero.title}
        subtitle={hero.subtitle}
        description={hero.description}
        background_image_url={hero.background_image_url}
        className="min-h-screen -mt-14 md:-mt-16"
        containerClassName="px-4 sm:px-8 md:px-16 py-12 sm:py-16"
      />

      {/* Institutional Content */}
      <div className="bg-white dark:bg-gray-900">
        <InstitutionalOverview
          title={overview.title}
          items={overview.items}
        />

        {/* Core Values */}
        <section
          className="relative w-full py-24 md:py-32 flex items-center justify-center text-center overflow-hidden"
          style={{
            backgroundImage: `url(${coreValues.background_image_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/65"></div>

          {/* Content */}
          <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-8 md:px-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-8 leading-tight" style={{ color: '#50a2ff' }}>
              {coreValues.title}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-white leading-relaxed font-normal max-w-3xl mx-auto">
              {coreValues.description}
            </p>
          </div>
        </section>

        {/* Education Commitment */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          <div className="w-full px-4 sm:px-8 md:px-16 max-w-[1400px] mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Our Commitment to Quality Education and Innovation
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                At Mandaluyong College of Science and Technology, we strive to provide accessible, high-quality education that empowers our students. Our dedication to advancing instruction and research ensures that we remain at the forefront of academic excellence.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {/* Card 1 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 text-center transition">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                  <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Collaborating for a Brighter Future
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  We actively collaborate with stakeholders to enhance educational outcomes.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 text-center transition">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Continuous Improvement in Education
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  Our focus on continuous improvement drives us to innovate and adapt.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 text-center transition">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4">
                  <svg className="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Fostering Excellence in Research and Instruction
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  We prioritize research initiatives that contribute to societal development.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Programs Section - Carousel */}
        <ProgramsCarousel />

        {/* CTA Section */}
        <section className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 py-16">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">Ready to Shape Your Future?</h2>
            <p className="text-sm sm:text-base md:text-xl mb-8 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Join a vibrant academic community where leadership, innovation, and excellence thrive. Whether you&apos;re just beginning or advancing your path, we&apos;re here to empower your journey.
            </p>
            <Link
              href="/admissions"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-[#003a7a] transition"
            >
              Apply Now <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
