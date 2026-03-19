'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AdmissionsBanner from '@/components/academics/admissions/AdmissionsBanner'
import Qualifications from '@/components/academics/admissions/Qualifications'
import RequiredStrand, { StrandItem } from '@/components/academics/admissions/RequiredStrand'
import DocumentaryRequirement from '@/components/academics/admissions/DocumentaryRequirement'
import Goals from '@/components/academics/admissions/AdmissionsGoals'
import AdmissionsCTA from '@/components/academics/admissions/AdmissionsCTA'
import AboutWhyChoose, { WhyChooseCard } from '@/components/about/AboutWhyChoose'

interface WhyChooseCardData {
  id: number
  icon: string
  title: string
  description: string
  icon_color: string
  icon_bg_color_light: string
  icon_bg_color_dark: string
  order: number
}

interface QualificationItem {
  id: number
  qualification_text: string
  order_index: number
}

interface GoalItem {
  id: number
  goal_text: string
  icon_name: string
  order_index: number
}

interface SubRequirement {
  id: number
  requirement_text: string
  requirement_type: string
  order_index: number
}

interface DocumentaryRequirementItem {
  id: number
  requirement_text: string
  requirement_type: string
  order_index: number
  sub_requirements?: SubRequirement[]
}

interface ProcedureItem {
  id: number
  step_number: number
  step_title: string
  step_description: string | null
  link_text: string | null
  link_url: string | null
  note_text: string | null
  note_type: string | null
  order_index: number
}

interface RealtimeAdmissionsWrapperProps {
  bannerImageUrl?: string
  initialWhyChooseTitle?: string
  initialWhyChooseSubtitle?: string
  initialWhyChooseCards?: WhyChooseCard[]
}

export default function RealtimeAdmissionsWrapper({
  bannerImageUrl: initialBannerImageUrl = '/banner.jpg',
  initialWhyChooseTitle = 'Why Choose Mandaluyong College of Science and Technology?',
  initialWhyChooseSubtitle = 'Discover what sets MCST apart. We are dedicated to providing transformative education, fostering innovation, and building a community committed to public service and excellence.',
  initialWhyChooseCards = [],
}: RealtimeAdmissionsWrapperProps) {
  const [isMounted, setIsMounted] = useState(false)

  // Banner
  const [bannerImageUrl, setBannerImageUrl] = useState(initialBannerImageUrl)

  // Qualifications
  const [qualifications, setQualifications] = useState<QualificationItem[]>([])

  // Required Strands
  const [strands, setStrands] = useState<StrandItem[]>([])
  const [strandsLoading, setStrandsLoading] = useState(true)

  // Documentary Requirements
  const [documentaryRequirements, setDocumentaryRequirements] = useState<DocumentaryRequirementItem[]>([])

  // Procedures
  const [procedures, setProcedures] = useState<ProcedureItem[]>([])

  // Goals
  const [goals, setGoals] = useState<GoalItem[]>([])

  // Why Choose
  const [whyChooseTitle, setWhyChooseTitle] = useState(initialWhyChooseTitle)
  const [whyChooseSubtitle, setWhyChooseSubtitle] = useState(initialWhyChooseSubtitle)
  const [whyChooseCards, setWhyChooseCards] = useState<WhyChooseCard[]>(initialWhyChooseCards)

  // Admissions CTA
  const [ctaTitle, setCtaTitle] = useState('MCST Mandaluyong College of Science and Technology')
  const [ctaDescription, setCtaDescription] = useState('Begin your journey with an institution dedicated to excellence in science, innovation, and inclusive education. At MCST, we nurture future-ready leaders and critical thinkers committed to national development and global competitiveness.')
  const [ctaImages, setCtaImages] = useState<any[]>([])

  // ── Fetchers ──────────────────────────────────────────────────────────────

  const fetchBanner = async () => {
    try {
      const res = await fetch('/api/admissions/banner-settings')
      if (res.ok) {
        const data = await res.json()
        if (data?.banner_image_url) setBannerImageUrl(data.banner_image_url)
      }
    } catch (e) {
      console.error('Error fetching banner:', e)
    }
  }

  const fetchQualifications = async () => {
    try {
      const res = await fetch('/api/admissions/qualifications')
      if (res.ok) {
        const data: QualificationItem[] = await res.json()
        if (Array.isArray(data)) setQualifications(data)
      }
    } catch (e) {
      console.error('Error fetching qualifications:', e)
    }
  }

  const fetchStrands = async () => {
    try {
      const res = await fetch('/api/admissions/required-strands')
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          setStrands(
            data.map((s: { id: number; program: string; strand_requirement: string }) => ({
              id: String(s.id),
              program: s.program,
              strandRequirement: s.strand_requirement,
            }))
          )
        }
      }
    } catch (e) {
      console.error('Error fetching strands:', e)
    } finally {
      setStrandsLoading(false)
    }
  }

  const fetchDocumentaryRequirements = async () => {
    try {
      const res = await fetch('/api/admissions/documentary-requirements')
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) setDocumentaryRequirements(data)
      }
    } catch (e) {
      console.error('Error fetching documentary requirements:', e)
    }
  }

  const fetchProcedures = async () => {
    try {
      const res = await fetch('/api/admissions/admission-procedures')
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) setProcedures(data)
      }
    } catch (e) {
      console.error('Error fetching procedures:', e)
    }
  }

  const fetchGoals = async () => {
    try {
      const res = await fetch('/api/admissions/goals')
      if (res.ok) {
        const data: GoalItem[] = await res.json()
        if (Array.isArray(data)) setGoals(data)
      }
    } catch (e) {
      console.error('Error fetching goals:', e)
    }
  }

  const fetchWhyChoose = async () => {
    try {
      const { data: sectionData, error: sectionError } = await supabase
        .from('why_choose_about_page')
        .select('*')
        .eq('is_active', true)
        .limit(1)
        .single()

      if (!sectionError && sectionData) {
        setWhyChooseTitle(sectionData.title)
        setWhyChooseSubtitle(sectionData.subtitle)
      }

      const { data: cardsData, error: cardsError } = await supabase
        .from('why_choose_cards_about_page')
        .select('*')
        .order('order', { ascending: true })

      if (!cardsError && cardsData) {
        const mappedCards: WhyChooseCard[] = cardsData.map((card: WhyChooseCardData) => ({
          id: String(card.id),
          icon: card.icon,
          title: card.title,
          description: card.description,
          iconColor: card.icon_color,
          bgColorLight: card.icon_bg_color_light,
          bgColorDark: card.icon_bg_color_dark,
        }))
        setWhyChooseCards(mappedCards)
      }
    } catch (e) {
      console.error('Error fetching why choose:', e)
    }
  }

  const fetchCTA = async () => {
    try {
      const res = await fetch('/api/admissions/cta')
      if (res.ok) {
        const data = await res.json()
        if (data) {
          setCtaTitle(data.title)
          setCtaDescription(data.description)
          if (data.images) {
            setCtaImages(data.images.map((img: any) => ({
              id: String(img.id),
              image: img.image_url,
              altText: img.alt_text
            })))
          }
        }
      }
    } catch (e) {
      console.error('Error fetching admissions CTA:', e)
    }
  }

  const fetchAllData = async () => {
    await Promise.all([
      fetchBanner(),
      fetchQualifications(),
      fetchStrands(),
      fetchDocumentaryRequirements(),
      fetchProcedures(),
      fetchGoals(),
      fetchWhyChoose(),
      fetchCTA(),
    ])
  }

  // ── Realtime Subscriptions ─────────────────────────────────────────────────

  const setupRealtimeSubscriptions = () => {
    const bannerChannel = supabase
      .channel('admissions_banner_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admissions_banner_settings' }, () => {
        if (isMounted) fetchBanner()
      })
      .subscribe()

    const qualChannel = supabase
      .channel('admissions_qualifications_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admissions_qualifications' }, () => {
        if (isMounted) fetchQualifications()
      })
      .subscribe()

    const strandsChannel = supabase
      .channel('admissions_strands_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admissions_required_strands' }, () => {
        if (isMounted) fetchStrands()
      })
      .subscribe()

    const docReqChannel = supabase
      .channel('admissions_doc_req_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'admissions_documentary_requirements' },
        () => {
          if (isMounted) fetchDocumentaryRequirements()
        }
      )
      .subscribe()

    const procChannel = supabase
      .channel('admissions_procedures_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'admissions_admission_procedures' },
        () => {
          if (isMounted) fetchProcedures()
        }
      )
      .subscribe()

    const goalsChannel = supabase
      .channel('admissions_goals_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admissions_goals' }, () => {
        if (isMounted) fetchGoals()
      })
      .subscribe()

    const whyChooseSectionChannel = supabase
      .channel('why_choose_section_realtime_admissions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'why_choose_about_page' }, () => {
        if (isMounted) fetchWhyChoose()
      })
      .subscribe()

    const whyChooseCardsChannel = supabase
      .channel('why_choose_cards_realtime_admissions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'why_choose_cards_about_page' }, () => {
        if (isMounted) fetchWhyChoose()
      })
      .subscribe()

    const ctaChannel = supabase
      .channel('admissions_cta_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admissions_cta' }, () => {
        if (isMounted) fetchCTA()
      })
      .subscribe()

    const ctaImagesChannel = supabase
      .channel('admissions_cta_images_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admissions_cta_images' }, () => {
        if (isMounted) fetchCTA()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(bannerChannel)
      supabase.removeChannel(qualChannel)
      supabase.removeChannel(strandsChannel)
      supabase.removeChannel(docReqChannel)
      supabase.removeChannel(procChannel)
      supabase.removeChannel(goalsChannel)
      supabase.removeChannel(whyChooseSectionChannel)
      supabase.removeChannel(whyChooseCardsChannel)
      supabase.removeChannel(ctaChannel)
      supabase.removeChannel(ctaImagesChannel)
    }
  }

  useEffect(() => {
    setIsMounted(true)
    fetchAllData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!isMounted) return
    const unsubscribe = setupRealtimeSubscriptions()
    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <AdmissionsBanner backgroundImageUrl={bannerImageUrl} />
      <Qualifications items={qualifications} />
      <RequiredStrand items={strands} isLoading={strandsLoading} />
      <DocumentaryRequirement items={documentaryRequirements} procedures={procedures} />
      <Goals goals={goals} />
      <AboutWhyChoose
        title={whyChooseTitle}
        subtitle={whyChooseSubtitle}
        cards={whyChooseCards}
      />
      <AdmissionsCTA 
        title={ctaTitle}
        description={ctaDescription}
        images={ctaImages.length > 0 ? ctaImages : undefined}
        dynamic={true}
      />
    </div>
  )
}
