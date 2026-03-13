'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import ApplyHeroSection from '@/components/apply/ApplyHeroSection'
import ApplyRequirementsAndProcedure from '@/components/apply/ApplyRequirementsAndProcedure'
import ApplyLocationMap from '@/components/apply/ApplyLocationMap'
import ApplyEnrollmentSchedule from '@/components/apply/ApplyEnrollmentSchedule'

interface HeroSectionData {
  id: string
  title: string
  subtitle: string
  description: string
  logo_image: string
}

interface RequirementData {
  id: string | number
  description: string
}

interface RequirementItem {
  id: string | number
  description: string
}

interface ProcedureData {
  id: string | number
  step_number: number
  description: string
}

interface ProcedureStep {
  id: string | number
  stepNumber: number
  description: string
}

interface ScheduleItem {
  id: string
  date: string
  time: string
  yearLevel: string
  section: string
}

interface RawScheduleItem {
  id: string
  date: string
  time: string
  year_level: string
  section: string
}

export default function RealtimeApplyWrapper() {
  // Hero Section State
  const [heroTitle, setHeroTitle] = useState('Begin Your Future')
  const [heroSubtitle, setHeroSubtitle] = useState('At Mandaluyong College of Science and Technology')
  const [heroDescription, setHeroDescription] = useState(
    'Unlock your potential with world-class programs tailored for new applicants and transferees. Join a thriving academic community that fosters innovation, leadership, and excellence.'
  )
  const [logoImage, setLogoImage] = useState('/mcst-logo.png')

  // Requirements Section State
  const [requirementsTitle, setRequirementsTitle] = useState('Enrollment Procedure (Continuing Students)')
  const [enrollmentPeriod, setEnrollmentPeriod] = useState('A.Y. 2025–2026 (1st Semester)')
  const [enrollmentDates, setEnrollmentDates] = useState('June 16–20, 2025')
  const [requirements, setRequirements] = useState<RequirementItem[]>([])

  // Procedure Section State
  const [procedureSteps, setProcedureSteps] = useState<ProcedureStep[]>([])

  // Schedule Section State
  const [scheduleTitle, setScheduleTitle] = useState('Enrollment Schedule')
  const [scheduleSubtitle, setScheduleSubtitle] = useState('A.Y. 2025–2026 (1st Semester)')
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([])

  const fetchInitialData = useCallback(async () => {
    try {
      // Fetch hero section data
      const heroResponse = await fetch('/api/admin/apply/hero')
      if (heroResponse.ok) {
        const heroData = await heroResponse.json()
        if (heroData) {
          setHeroTitle(heroData.title)
          setHeroSubtitle(heroData.subtitle)
          setHeroDescription(heroData.description)
          setLogoImage(heroData.logo_image)
        }
      }

      // Fetch apply page header data (title, enrollment period, dates)
      const applyPageResponse = await fetch('/api/admin/apply')
      if (applyPageResponse.ok) {
        const applyPageData = await applyPageResponse.json()
        if (applyPageData) {
          setRequirementsTitle(applyPageData.title || 'Enrollment Procedure (Continuing Students)')
          setEnrollmentPeriod(applyPageData.enrollment_period || 'A.Y. 2025–2026 (1st Semester)')
          setEnrollmentDates(applyPageData.enrollment_dates || 'June 16–20, 2025')
        }
      }

      // Fetch requirements data
      const requirementsResponse = await fetch('/api/admin/apply/requirements')
      if (requirementsResponse.ok) {
        const requirementsData = await requirementsResponse.json()
        if (Array.isArray(requirementsData)) {
          const mapped: RequirementItem[] = requirementsData.map((req: RequirementData) => ({
            id: req.id,
            description: req.description,
          }))
          setRequirements(mapped)
        }
      }

      // Fetch procedure steps data
      const procedureResponse = await fetch('/api/admin/apply/procedure')
      if (procedureResponse.ok) {
        const procedureData = await procedureResponse.json()
        if (Array.isArray(procedureData)) {
          const mapped: ProcedureStep[] = procedureData.map((step: ProcedureData, index: number) => ({
            id: step.id,
            stepNumber: step.step_number || index + 1,
            description: step.description,
          }))
          setProcedureSteps(mapped)
          console.log('Procedure steps loaded:', mapped)
        }
      }

      // Fetch schedule data
      const scheduleResponse = await fetch('/api/admin/apply/schedule')
      if (scheduleResponse.ok) {
        const scheduleData = await scheduleResponse.json()
        if (scheduleData) {
          setScheduleTitle(scheduleData.title || 'Enrollment Schedule')
          setScheduleSubtitle(scheduleData.subtitle || 'A.Y. 2025–2026 (1st Semester)')
          if (Array.isArray(scheduleData.items)) {
            const mapped: ScheduleItem[] = scheduleData.items.map((item: RawScheduleItem) => ({
              id: item.id,
              date: item.date,
              time: item.time,
              yearLevel: item.year_level,
              section: item.section,
            }))
            setScheduleItems(mapped)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching initial data:', error)
    }
  }, [])

  const setupRealtimeSubscriptions = useCallback(() => {
    // Subscribe to apply_page_hero_section changes
    const heroChannel = supabase
      .channel('apply_hero_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'apply_page_hero_section' },
        async () => {
          const heroResponse = await fetch('/api/admin/apply/hero')
          if (heroResponse.ok) {
            const heroData = await heroResponse.json()
            if (heroData) {
              setHeroTitle(heroData.title)
              setHeroSubtitle(heroData.subtitle)
              setHeroDescription(heroData.description)
              setLogoImage(heroData.logo_image)
            }
          }
        }
      )
      .subscribe()

    // Subscribe to apply_page_requirements changes
    const requirementsChannel = supabase
      .channel('apply_requirements_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'apply_page_requirements' },
        async () => {
          const requirementsResponse = await fetch('/api/admin/apply/requirements')
          if (requirementsResponse.ok) {
            const requirementsData = await requirementsResponse.json()
            if (Array.isArray(requirementsData)) {
              const mapped: RequirementItem[] = requirementsData.map((req: RequirementData) => ({
                id: req.id,
                description: req.description,
              }))
              setRequirements(mapped)
            }
          }
        }
      )
      .subscribe()

    // Subscribe to apply_page_enrollment_procedure changes
    const procedureChannel = supabase
      .channel('apply_procedure_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'apply_page_enrollment_procedure' },
        async () => {
          const procedureResponse = await fetch('/api/admin/apply/procedure')
          if (procedureResponse.ok) {
            const procedureData = await procedureResponse.json()
            if (Array.isArray(procedureData)) {
              const mapped: ProcedureStep[] = procedureData.map((step: ProcedureData, index: number) => ({
                id: step.id,
                stepNumber: step.step_number || index + 1,
                description: step.description,
              }))
              setProcedureSteps(mapped)
              console.log('Procedure steps updated via realtime:', mapped)
            }
          }
        }
      )
      .subscribe()

    // Subscribe to apply_page header changes (title, enrollment_period, enrollment_dates)
    const applyPageChannel = supabase
      .channel('apply_page_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'apply_page' },
        async () => {
          const applyPageResponse = await fetch('/api/admin/apply')
          if (applyPageResponse.ok) {
            const applyPageData = await applyPageResponse.json()
            if (applyPageData) {
              setRequirementsTitle(applyPageData.title || 'Enrollment Procedure (Continuing Students)')
              setEnrollmentPeriod(applyPageData.enrollment_period || 'A.Y. 2025–2026 (1st Semester)')
              setEnrollmentDates(applyPageData.enrollment_dates || 'June 16–20, 2025')
              console.log('Apply page header updated via realtime:', applyPageData)
            }
          }
        }
      )
      .subscribe()

    // Subscribe to enrollment schedule changes
    const scheduleChannel = supabase
      .channel('apply_schedule_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'apply_page_enrollment_schedule' },
        async () => {
          const scheduleResponse = await fetch('/api/admin/apply/schedule')
          if (scheduleResponse.ok) {
            const scheduleData = await scheduleResponse.json()
            if (scheduleData) {
              setScheduleTitle(scheduleData.title || 'Enrollment Schedule')
              setScheduleSubtitle(scheduleData.subtitle || 'A.Y. 2025–2026 (1st Semester)')
            }
          }
        }
      )
      .subscribe()

    // Subscribe to enrollment schedule items changes
    const scheduleItemsChannel = supabase
      .channel('apply_schedule_items_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'apply_page_enrollment_schedule_items' },
        async () => {
          const scheduleResponse = await fetch('/api/admin/apply/schedule')
          if (scheduleResponse.ok) {
            const scheduleData = await scheduleResponse.json()
            if (Array.isArray(scheduleData.items)) {
              const mapped: ScheduleItem[] = scheduleData.items.map((item: RawScheduleItem) => ({
                id: item.id,
                date: item.date,
                time: item.time,
                yearLevel: item.year_level,
                section: item.section,
              }))
              setScheduleItems(mapped)
            }
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(heroChannel)
      supabase.removeChannel(requirementsChannel)
      supabase.removeChannel(procedureChannel)
      supabase.removeChannel(applyPageChannel)
      supabase.removeChannel(scheduleChannel)
      supabase.removeChannel(scheduleItemsChannel)
    }
  }, [])

  useEffect(() => {
    fetchInitialData()
    return setupRealtimeSubscriptions()
  }, [fetchInitialData, setupRealtimeSubscriptions])

  return (
    <div className="min-h-screen bg-white">
      <div className="-mt-14 md:-mt-16">
        <ApplyHeroSection
          title={heroTitle}
          subtitle={heroSubtitle}
          description={heroDescription}
          logoImage={logoImage}
        />
      </div>

      {/* Map Section + Requirements and Procedure */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Left - Google Map */}
            <div className="w-full flex items-center justify-center order-2 md:order-1">
              <ApplyLocationMap title="Mandaluyong College of Science and Technology" />
            </div>

            {/* Right - Enrollment Requirements and Procedure */}
            <div className="border border-gray-200 rounded-lg p-6 md:p-8 bg-white shadow-sm order-1 md:order-2">
              <ApplyRequirementsAndProcedure
                title={requirementsTitle}
                enrollmentPeriod={enrollmentPeriod}
                enrollmentDates={enrollmentDates}
                requirements={requirements}
                procedures={procedureSteps}
                compact
              />
            </div>
          </div>
        </div>
      </section>

      <ApplyEnrollmentSchedule
        title={scheduleTitle}
        subtitle={scheduleSubtitle}
        items={scheduleItems}
      />
    </div>
  )
}
