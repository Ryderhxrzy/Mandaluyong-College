'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Hero from '@/components/Hero'
import InstitutionalOverview, { OverviewItem } from '@/components/InstitutionalOverview'
import ProgramsCarousel from '@/components/ProgramsCarousel'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface RealtimeHomeWrapperProps {
  initialHero: any
  initialCoreValues: any
  initialOverview: { title: string, items: OverviewItem[] }
}

export default function RealtimeHomeWrapper({
  initialHero,
  initialCoreValues,
  initialOverview
}: RealtimeHomeWrapperProps) {
  const [hero, setHero] = useState(initialHero)
  const [coreValues, setCoreValues] = useState(initialCoreValues)
  const [overview, setOverview] = useState(initialOverview)

  useEffect(() => {
    // 1. Subscribe to Hero Section
    const heroChannel = supabase
      .channel('hero_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'hero_section_home_page' },
        (payload) => {
          if (payload.new) {
            const newData = payload.new as any
            setHero({
              id: newData.id,
              title: newData.title,
              subtitle: newData.subtitle,
              description: newData.description,
              background_image_url: newData.background_image,
              is_active: newData.is_active,
            })
          }
        }
      )
      .subscribe()

    // 2. Subscribe to Core Values
    const coreValuesChannel = supabase
      .channel('core_values_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'core_values_home_page' },
        (payload) => {
          if (payload.new) {
            const newData = payload.new as any
            setCoreValues({
              id: newData.id,
              title: newData.title,
              description: newData.description,
              background_image_url: newData.background_image,
              is_active: newData.is_active,
            })
          }
        }
      )
      .subscribe()

    // 3. Subscribe to Institutional Overview
    const overviewChannel = supabase
      .channel('overview_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'institutional_overview_home_page' },
        async () => {
          // For overview items, it's easier to refetch since it's a list with ordering and filtering
          const { data, error } = await supabase
            .from('institutional_overview_home_page')
            .select('*')
            .order('order', { ascending: true })

          if (!error && data && data.length > 0) {
            setOverview({
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
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(heroChannel)
      supabase.removeChannel(coreValuesChannel)
      supabase.removeChannel(overviewChannel)
    }
  }, [])

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

        {/* Education Commitment remains static as it's not currently dynamic in the same way */}
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
        <ProgramsCarousel realtime={true} />

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
