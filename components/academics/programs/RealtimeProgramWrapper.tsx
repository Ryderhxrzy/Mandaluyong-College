'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import ProgramsBanner from '@/components/academics/programs/ProgramsBanner'
import FeaturedPrograms, {
  FeaturedProgramCard,
} from '@/components/academics/programs/FeaturedPrograms'
import ProgramsCTA from '@/components/academics/programs/ProgramsCTA'

const DEFAULT_CARDS: FeaturedProgramCard[] = [
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

interface HeaderData {
  id: string | null
  title: string
  subtitle: string
}

interface BannerData {
  id: string | null
  imageUrl: string
}

interface CTAData {
  id: string | null
  title: string
  subtitle: string
}

interface RealtimeProgramWrapperProps {
  bannerImageUrl?: string
}

export default function RealtimeProgramWrapper({
  bannerImageUrl = '/banner.jpg',
}: RealtimeProgramWrapperProps) {
  const [headerData, setHeaderData] = useState<HeaderData>({
    id: null,
    title: 'Our Featured Programs',
    subtitle: 'Discover academic paths tailored for your success.',
  })

  const [bannerData, setBannerData] = useState<BannerData>({
    id: null,
    imageUrl: '/banner.jpg',
  })

  const [ctaData, setCtaData] = useState<CTAData>({
    id: null,
    title: 'Elevate Your Future With Mandaluyong College of Science and Technology',
    subtitle: 'Whether you\'re aiming to innovate, lead, serve, or create—your journey starts here. Our programs are designed to not just prepare you for a job, but to shape you into a visionary ready to transform the world.',
  })

  const [cards, setCards] = useState<FeaturedProgramCard[]>([])
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const fetchHeader = useCallback(async () => {
    try {
      console.log('Fetching header from /api/admin/programs/header...')
      const response = await fetch('/api/admin/programs/header')
      console.log('Header response status:', response.status)

      if (response.ok) {
        const header = await response.json()
        console.log('Header data received:', header)
        setHeaderData(header)
      } else {
        console.error('Failed to fetch header:', response.status)
        const errorData = await response.json().catch(() => null)
        console.error('Error details:', errorData)
      }
    } catch (error) {
      console.error('Error fetching header:', error)
    }
  }, [])

  const fetchCards = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/programs/featured')
      if (response.ok) {
        const fetchedCards = await response.json()
        console.log('Fetched cards from API:', fetchedCards)
        if (Array.isArray(fetchedCards) && fetchedCards.length > 0) {
          setCards(fetchedCards)
        } else {
          // Show defaults only if no data
          setCards(DEFAULT_CARDS)
        }
      } else {
        console.error('Failed to fetch cards:', response.status)
        setCards(DEFAULT_CARDS)
      }
    } catch (error) {
      console.error('Error fetching cards:', error)
      setCards(DEFAULT_CARDS)
    }
  }, [])

  const fetchBanner = useCallback(async () => {
    try {
      console.log('Fetching banner...')
      const response = await fetch('/api/admin/programs/hero')
      if (response.ok) {
        const banner = await response.json()
        console.log('Banner data received:', banner)
        setBannerData(banner)
      }
    } catch (error) {
      console.error('Error fetching banner:', error)
    }
  }, [])

  const fetchCTA = useCallback(async () => {
    try {
      console.log('Fetching CTA...')
      const response = await fetch('/api/admin/programs/cta')
      if (response.ok) {
        const cta = await response.json()
        console.log('CTA data received:', cta)
        setCtaData(cta)
      }
    } catch (error) {
      console.error('Error fetching CTA:', error)
    }
  }, [])

  const setupRealtimeSubscriptions = useCallback(() => {
    console.log('Setting up real-time subscriptions...')

    // Subscribe to header changes
    const headerChannel = supabase
      .channel('programs_header_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'programs_header' },
        async (payload) => {
          console.log('Header change detected:', payload)
          await fetchHeader()
        }
      )
      .subscribe((status) => {
        console.log('Header subscription status:', status)
      })

    // Subscribe to featured programs changes
    const programsChannel = supabase
      .channel('programs_featured_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'programs_featured_programs' },
        async (payload) => {
          console.log('Programs change detected:', payload)
          await fetchCards()
        }
      )
      .subscribe((status) => {
        console.log('Programs subscription status:', status)
      })

    // Subscribe to hero changes
    const bannerChannel = supabase
      .channel('programs_hero_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'programs_hero_section' },
        async (payload) => {
          console.log('Banner change detected:', payload)
          await fetchBanner()
        }
      )
      .subscribe((status) => {
        console.log('Banner subscription status:', status)
      })

    // Subscribe to CTA changes
    const ctaChannel = supabase
      .channel('programs_cta_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'programs_cta_section' },
        async (payload) => {
          console.log('CTA change detected:', payload)
          await fetchCTA()
        }
      )
      .subscribe((status) => {
        console.log('CTA subscription status:', status)
      })

    return () => {
      console.log('Cleaning up subscriptions...')
      supabase.removeChannel(headerChannel)
      supabase.removeChannel(programsChannel)
      supabase.removeChannel(bannerChannel)
      supabase.removeChannel(ctaChannel)
    }
  }, [fetchHeader, fetchCards, fetchBanner, fetchCTA])

  useEffect(() => {
    let mounted = true

    const initializeData = async () => {
      if (mounted) {
        await fetchCards()
        await fetchHeader()
        await fetchBanner()
        await fetchCTA()
        if (mounted) {
          setIsInitialLoad(false)
        }
      }
    }

    initializeData()
    return () => {
      mounted = false
    }
  }, [fetchCards, fetchHeader, fetchBanner, fetchCTA])

  useEffect(() => {
    // Set up real-time subscriptions after initial load
    if (!isInitialLoad) {
      return setupRealtimeSubscriptions()
    }
  }, [isInitialLoad, setupRealtimeSubscriptions])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <ProgramsBanner backgroundImageUrl={bannerData.imageUrl} />
      <FeaturedPrograms
        title={headerData.title}
        subtitle={headerData.subtitle}
        cards={cards}
      />
      <ProgramsCTA title={ctaData.title} subtitle={ctaData.subtitle} />
    </div>
  )
}
