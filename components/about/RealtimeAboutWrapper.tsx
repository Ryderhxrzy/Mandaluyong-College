'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AboutBanner from '@/components/about/AboutBanner'
import AboutKeyStatistics from '@/components/about/AboutKeyStatistics'
import AboutGoalsPhilosophy from '@/components/about/AboutGoalsPhilosophy'
import AboutMissionVision from '@/components/about/AboutMissionVision'
import AboutCoreValuesSection from '@/components/about/AboutCoreValuesSection'
import AboutWhyChoose, { WhyChooseCard } from '@/components/about/AboutWhyChoose'
import AboutJoinCommunity from '@/components/about/AboutJoinCommunity'

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

interface RealtimeAboutWrapperProps {
  initialWhyChooseTitle?: string
  initialWhyChooseSubtitle?: string
  initialWhyChooseCards?: WhyChooseCard[]
}

export default function RealtimeAboutWrapper({
  initialWhyChooseTitle = 'Why Choose Mandaluyong College of Science and Technology?',
  initialWhyChooseSubtitle = 'Discover what sets MCST apart. We are dedicated to providing transformative education, fostering innovation, and building a community committed to public service and excellence.',
  initialWhyChooseCards = [],
}: RealtimeAboutWrapperProps) {
  // Why Choose Section State
  const [whyChooseTitle, setWhyChooseTitle] = useState(initialWhyChooseTitle)
  const [whyChooseSubtitle, setWhyChooseSubtitle] = useState(initialWhyChooseSubtitle)
  const [whyChooseCards, setWhyChooseCards] = useState<WhyChooseCard[]>(initialWhyChooseCards)

  useEffect(() => {
    fetchInitialData()
    setupRealtimeSubscriptions()
  }, [])

  const fetchInitialData = async () => {
    try {
      // Fetch section data
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

      // Fetch cards
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
      console.error('Error fetching initial why choose data:', error)
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

  return (
    <div className="min-h-screen bg-white">
      <AboutBanner />
      <AboutKeyStatistics />
      <AboutGoalsPhilosophy />
      <AboutMissionVision />
      <AboutCoreValuesSection />
      <AboutWhyChoose
        title={whyChooseTitle}
        subtitle={whyChooseSubtitle}
        cards={whyChooseCards}
      />
      <AboutJoinCommunity />
    </div>
  )
}
