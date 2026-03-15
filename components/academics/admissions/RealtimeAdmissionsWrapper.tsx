'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AdmissionsBanner from '@/components/academics/admissions/AdmissionsBanner'
import Qualifications from '@/components/academics/admissions/Qualifications'
import RequiredStrand from '@/components/academics/admissions/RequiredStrand'
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

interface RealtimeAdmissionsWrapperProps {
  bannerImageUrl?: string
  initialWhyChooseTitle?: string
  initialWhyChooseSubtitle?: string
  initialWhyChooseCards?: WhyChooseCard[]
}

export default function RealtimeAdmissionsWrapper({
  bannerImageUrl = '/banner.jpg',
  initialWhyChooseTitle = 'Why Choose Mandaluyong College of Science and Technology?',
  initialWhyChooseSubtitle = 'Discover what sets MCST apart. We are dedicated to providing transformative education, fostering innovation, and building a community committed to public service and excellence.',
  initialWhyChooseCards = [],
}: RealtimeAdmissionsWrapperProps) {
  const [whyChooseTitle, setWhyChooseTitle] = useState(initialWhyChooseTitle)
  const [whyChooseSubtitle, setWhyChooseSubtitle] = useState(initialWhyChooseSubtitle)
  const [whyChooseCards, setWhyChooseCards] = useState<WhyChooseCard[]>(
    initialWhyChooseCards.length > 0
      ? initialWhyChooseCards
      : [
          {
            id: '1',
            icon: 'BookOpen',
            title: 'Quality Education',
            description: 'Comprehensive programs designed to prepare students for success.',
            iconColor: '#003a7a',
            bgColorLight: '#ebf2fa',
            bgColorDark: '#1e3a8a',
          },
          {
            id: '2',
            icon: 'Lightbulb',
            title: 'Innovation & Research',
            description: 'Dynamic research culture driving continuous improvement.',
            iconColor: '#003a7a',
            bgColorLight: '#ebf2fa',
            bgColorDark: '#1e3a8a',
          },
          {
            id: '3',
            icon: 'Users',
            title: 'Supportive Community',
            description: 'A caring environment where everyone is empowered to thrive.',
            iconColor: '#003a7a',
            bgColorLight: '#ebf2fa',
            bgColorDark: '#1e3a8a',
          },
          {
            id: '4',
            icon: 'Award',
            title: 'Excellence & Service',
            description: 'Guided by values of integrity, nationalism, and public service.',
            iconColor: '#003a7a',
            bgColorLight: '#ebf2fa',
            bgColorDark: '#1e3a8a',
          },
        ]
  )

  const fetchInitialData = async () => {
    try {
      // Fetch why choose section data
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

      // Fetch why choose cards
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
    } catch (error) {
      console.error('Error fetching initial data:', error)
    }
  }

  const setupRealtimeSubscriptions = () => {
    // Subscribe to why_choose_about_page changes
    const whyChooseSectionChannel = supabase
      .channel('why_choose_section_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'why_choose_about_page' },
        async () => {
          const { data, error } = await supabase
            .from('why_choose_about_page')
            .select('*')
            .eq('is_active', true)
            .limit(1)
            .single()

          if (!error && data) {
            setWhyChooseTitle(data.title)
            setWhyChooseSubtitle(data.subtitle)
          }
        }
      )
      .subscribe()

    // Subscribe to why_choose_cards_about_page changes
    const whyChooseCardsChannel = supabase
      .channel('why_choose_cards_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'why_choose_cards_about_page' },
        async () => {
          const { data, error } = await supabase
            .from('why_choose_cards_about_page')
            .select('*')
            .order('order', { ascending: true })

          if (!error && data) {
            const mappedCards: WhyChooseCard[] = data.map((card: WhyChooseCardData) => ({
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
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(whyChooseSectionChannel)
      supabase.removeChannel(whyChooseCardsChannel)
    }
  }

  useEffect(() => {
    fetchInitialData()
    setupRealtimeSubscriptions()
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <AdmissionsBanner backgroundImageUrl={bannerImageUrl} />
      <Qualifications />
      <RequiredStrand />
      <DocumentaryRequirement />
      <Goals />
      <AboutWhyChoose
        title={whyChooseTitle}
        subtitle={whyChooseSubtitle}
        cards={whyChooseCards}
      />
      <AdmissionsCTA />
    </div>
  )
}
