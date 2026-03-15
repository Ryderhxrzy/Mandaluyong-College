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

  const [cards, setCards] = useState<FeaturedProgramCard[]>(DEFAULT_CARDS)

  const fetchHeader = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/programs/header')
      if (response.ok) {
        const header = await response.json()
        console.log('Fetched header data:', header)
        setHeaderData(header)
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
        console.log('Fetched cards:', fetchedCards)
        setCards(fetchedCards)
      }
    } catch (error) {
      console.error('Error fetching cards:', error)
    }
  }, [])

  const fetchData = useCallback(async () => {
    fetchHeader()
    fetchCards()
  }, [fetchHeader, fetchCards])

  const setupRealtimeSubscriptions = useCallback(() => {
    // Subscribe to header changes
    const headerChannel = supabase
      .channel('programs_header_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'programs_header' },
        () => {
          console.log('Header change detected - refetching...')
          fetchHeader()
        }
      )
      .subscribe()

    // Subscribe to featured programs changes
    const programsChannel = supabase
      .channel('programs_featured_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'programs_featured_programs' },
        () => {
          console.log('Programs change detected - refetching...')
          fetchCards()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(headerChannel)
      supabase.removeChannel(programsChannel)
    }
  }, [fetchHeader, fetchCards])

  useEffect(() => {
    fetchData()
    return setupRealtimeSubscriptions()
  }, [fetchData, setupRealtimeSubscriptions])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <ProgramsBanner backgroundImageUrl={bannerImageUrl} />
      <FeaturedPrograms
        title={headerData.title}
        subtitle={headerData.subtitle}
        cards={cards}
      />
      <ProgramsCTA />
    </div>
  )
}
