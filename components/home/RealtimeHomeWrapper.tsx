'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Hero from '@/components/home/Hero'
import InstitutionalOverview, { OverviewItem } from '@/components/home/InstitutionalOverview'
import ProgramsCarousel from '@/components/home/ProgramsCarousel'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import CoreValues from '@/components/home/CoreValues'
import EducationCommitment, { CommitmentItem } from '@/components/home/EducationCommitment'
import CTA from '@/components/home/CTA'

interface RealtimeHomeWrapperProps {
  initialHero: any
  initialCoreValues: any
  initialOverview: { title: string, items: OverviewItem[] }
  initialPrograms: any[]
  initialCommitment: any
  initialCTA: any
}

export default function RealtimeHomeWrapper({
  initialHero,
  initialCoreValues,
  initialOverview,
  initialPrograms,
  initialCommitment,
  initialCTA
}: RealtimeHomeWrapperProps) {
  const [hero, setHero] = useState(initialHero)
  const [coreValues, setCoreValues] = useState(initialCoreValues)
  const [overview, setOverview] = useState(initialOverview)
  const [programs, setPrograms] = useState(initialPrograms?.filter((p: any) => p.is_active) || [])
  const [commitment, setCommitment] = useState(initialCommitment || { title: '', subtitle: '', items: [] })
  const [cta, setCta] = useState(initialCTA)

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
            setPrograms(data.filter((p: any) => p.is_active))
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
              items: data.filter((item: any) => item.is_active)
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
            const newData = payload.new as any
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
        <InstitutionalOverview
          title={overview.title}
          items={overview.items}
        />

        {/* Core Values */}
        <CoreValues
          title={coreValues.title}
          description={coreValues.description}
          backgroundImageUrl={coreValues.background_image_url}
        />

        {/* Education Commitment */}
        <EducationCommitment
          title={commitment.title}
          subtitle={commitment.subtitle}
          items={commitment.items.map((item: any) => ({
            id: String(item.id),
            icon: item.icon,
            description: item.value, // value column is used for item content
            iconColor: item.icon_color,
            bgColorLight: item.icon_bg_color_light,
            bgColorDark: item.icon_bg_color_dark,
            iconTitle: item.icon_title
          }))}
        />

        {/* Programs Section - Carousel */}
        <ProgramsCarousel slides={programs} />

        {/* CTA Section */}
        {cta.is_active && (
          <CTA
            title={cta.title}
            description={cta.description}
          />
        )}
      </div>
    </>
  )
}
