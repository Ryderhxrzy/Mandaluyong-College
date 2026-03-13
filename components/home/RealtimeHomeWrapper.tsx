'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import Hero from '@/components/home/Hero'
import InstitutionalOverview, { OverviewItem } from '@/components/home/InstitutionalOverview'
import ProgramsCarousel from '@/components/home/ProgramsCarousel'
import CoreValues from '@/components/home/CoreValues'
import EducationCommitment, { CommitmentItem } from '@/components/home/EducationCommitment'
import CTA from '@/components/home/CTA'

// Type definitions
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
  items: CommitmentItemData[]
}

interface CommitmentItemData {
  id: number
  title: string
  icon: string
  value: string
  icon_color: string
  icon_bg_color_light: string
  icon_bg_color_dark: string
  icon_title: string
  is_active: boolean
}

interface CTAData {
  title: string
  description: string
  is_active: boolean
}

interface OverviewData {
  title: string
  items: OverviewItem[]
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay }
  })
}

// Scroll animation wrapper component
function ScrollSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={fadeInUp}
      custom={delay}
    >
      {children}
    </motion.div>
  )
}

interface RealtimeHomeWrapperProps {
  initialHero: HeroData
  initialCoreValues: CoreValuesData
  initialOverview: OverviewData
  initialPrograms: ProgramData[]
  initialCommitment: CommitmentData | null
  initialCTA: CTAData
}

export default function RealtimeHomeWrapper({
  initialHero,
  initialCoreValues,
  initialOverview,
  initialPrograms,
  initialCommitment,
  initialCTA
}: RealtimeHomeWrapperProps) {
  const [hero, setHero] = useState<HeroData>(initialHero)
  const [coreValues, setCoreValues] = useState<CoreValuesData>(initialCoreValues)
  const [overview, setOverview] = useState<OverviewData>(initialOverview)
  const [programs, setPrograms] = useState<ProgramData[]>(initialPrograms?.filter((p: ProgramData) => p.is_active) || [])
  const [commitment, setCommitment] = useState<CommitmentData>(initialCommitment || { title: '', subtitle: '', items: [] })
  const [cta, setCta] = useState<CTAData>(initialCTA)

  useEffect(() => {
    // 1. Subscribe to Hero Section
    const heroChannel = supabase
      .channel('hero_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'hero_section_home_page' },
        (payload) => {
          if (payload.new) {
            const newData = payload.new as HeroData
            setHero({
              id: newData.id,
              title: newData.title,
              subtitle: newData.subtitle,
              description: newData.description,
              background_image_url: newData.background_image_url,
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
            const newData = payload.new as CoreValuesData
            setCoreValues({
              id: newData.id,
              title: newData.title,
              description: newData.description,
              background_image_url: newData.background_image_url,
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
              title: data[0].title as string,
              items: data.filter((item: CommitmentItemData) => item.is_active).map((item: CommitmentItemData) => ({
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

    // 4. Subscribe to Academic Programs
    const programsChannel = supabase
      .channel('programs_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'academic_programs_home_page' },
        async () => {
          const { data, error } = await supabase
            .from('academic_programs_home_page')
            .select('*')
            .order('order', { ascending: true })

          if (!error && data) {
            setPrograms(data.filter((p: ProgramData) => p.is_active))
          }
        }
      )
      .subscribe()

    // 5. Subscribe to Education Commitment
    const commitmentChannel = supabase
      .channel('commitment_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'quality_education_commitment_home_page' },
        async () => {
          const { data, error } = await supabase
            .from('quality_education_commitment_home_page')
            .select('*')
            .order('order', { ascending: true })

          if (!error && data && data.length > 0) {
            setCommitment({
              title: data[0].title || "Our Commitment to Quality Education and Innovation",
              subtitle: data[0].description || "At Mandaluyong College of Science and Technology, we strive to provide accessible, high-quality education that empowers our students. Our dedication to advancing instruction and research ensures that we remain at the forefront of academic excellence.",
              items: data.filter((item: CommitmentItemData) => item.is_active)
            })
          }
        }
      )
      .subscribe()

    // 6. Subscribe to CTA Section
    const ctaChannel = supabase
      .channel('cta_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cta_section_home_page' },
        (payload) => {
          if (payload.new) {
            const newData = payload.new as CTAData
            setCta({
              title: newData.title,
              description: newData.description,
              is_active: newData.is_active
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(heroChannel)
      supabase.removeChannel(coreValuesChannel)
      supabase.removeChannel(overviewChannel)
      supabase.removeChannel(programsChannel)
      supabase.removeChannel(commitmentChannel)
      supabase.removeChannel(ctaChannel)
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
        <ScrollSection delay={0.1}>
          <InstitutionalOverview
            title={overview.title}
            items={overview.items}
          />
        </ScrollSection>

        {/* Core Values */}
        <ScrollSection delay={0.2}>
          <CoreValues
            title={coreValues.title}
            description={coreValues.description}
            backgroundImageUrl={coreValues.background_image_url}
          />
        </ScrollSection>

        {/* Education Commitment */}
        <ScrollSection delay={0.2}>
          <EducationCommitment
            title={commitment.title}
            subtitle={commitment.subtitle}
            items={commitment.items.map((item: CommitmentItemData) => ({
              id: String(item.id),
              title: item.icon_title,
              icon: item.icon,
              description: item.value,
              iconColor: item.icon_color,
              bgColorLight: item.icon_bg_color_light,
              bgColorDark: item.icon_bg_color_dark
            }))}
          />
        </ScrollSection>

        {/* Programs Section - Carousel */}
        <ScrollSection delay={0.2}>
          <ProgramsCarousel slides={programs} />
        </ScrollSection>

        {/* CTA Section */}
        {cta.is_active && (
          <ScrollSection delay={0.2}>
            <CTA
              title={cta.title}
              description={cta.description}
            />
          </ScrollSection>
        )}
      </div>
    </>
  )
}
