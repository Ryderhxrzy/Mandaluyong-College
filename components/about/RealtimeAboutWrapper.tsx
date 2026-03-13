'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AboutBanner from '@/components/about/AboutBanner'
import AboutKeyStatistics, { StatItem, StatImage } from '@/components/about/AboutKeyStatistics'
import AboutGoalsPhilosophy, { GoalItem } from '@/components/about/AboutGoalsPhilosophy'
import AboutMissionVision from '@/components/about/AboutMissionVision'
import AboutCoreValuesSection from '@/components/about/AboutCoreValuesSection'
import AboutWhyChoose, { WhyChooseCard } from '@/components/about/AboutWhyChoose'
import AboutJoinCommunity from '@/components/about/AboutJoinCommunity'

interface KeyStatisticsItemData {
  id: number
  value: string
  label: string
}

interface KeyStatisticsImageData {
  id: number
  image: string
  alt_text: string
}

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

interface GoalItemData {
  id: number
  description: string
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
  // Banner Section State
  const [bannerBackgroundImage, setBannerBackgroundImage] = useState('/banner.jpg')

  // Key Statistics Section State
  const [keyStatisticsTitle, setKeyStatisticsTitle] = useState('Discover Our Impact: Key Statistics at Mandaluyong College of Science and Technology')
  const [keyStatisticsDescription, setKeyStatisticsDescription] = useState('At MCST, we pride ourselves on our vibrant community. Our commitment to excellence is reflected in our impressive statistics.')
  const [keyStatisticsItems, setKeyStatisticsItems] = useState<StatItem[]>([])
  const [keyStatisticsImages, setKeyStatisticsImages] = useState<StatImage[]>([])

  // Why Choose Section State
  const [whyChooseTitle, setWhyChooseTitle] = useState(initialWhyChooseTitle)
  const [whyChooseSubtitle, setWhyChooseSubtitle] = useState(initialWhyChooseSubtitle)
  const [whyChooseCards, setWhyChooseCards] = useState<WhyChooseCard[]>(initialWhyChooseCards)

  // Goals Section State
  const [goalTitle, setGoalTitle] = useState('Goals')
  const [goalItems, setGoalItems] = useState<GoalItem[]>([])

  // Philosophy Section State
  const [philosophyTitle, setPhilosophyTitle] = useState('Philosophy')
  const [philosophyDescription, setPhilosophyDescription] = useState('')
  const [philosophyImage, setPhilosophyImage] = useState('')
  const [philosophyImageAlt, setPhilosophyImageAlt] = useState('')

  useEffect(() => {
    fetchInitialData()
    setupRealtimeSubscriptions()
  }, [])

  const fetchInitialData = async () => {
    try {
      // Fetch banner data
      const { data: bannerData, error: bannerError } = await supabase
        .from('banner_about_page')
        .select('*')
        .eq('is_active', true)
        .limit(1)
        .single()

      if (!bannerError && bannerData) {
        setBannerBackgroundImage(bannerData.background_image)
      }

      // Fetch key statistics section data
      const { data: keyStatsData, error: keyStatsError } = await supabase
        .from('key_statistics_about_page')
        .select('*')
        .eq('is_active', true)
        .limit(1)
        .single()

      if (!keyStatsError && keyStatsData) {
        setKeyStatisticsTitle(keyStatsData.title)
        setKeyStatisticsDescription(keyStatsData.description)

        // Fetch key statistics items
        const { data: itemsData } = await supabase
          .from('key_statistics_items_about_page')
          .select('*')
          .eq('statistics_id', keyStatsData.id)
          .order('order', { ascending: true })

        // Fetch key statistics images
        const { data: imagesData } = await supabase
          .from('key_statistics_images_about_page')
          .select('*')
          .eq('statistics_id', keyStatsData.id)
          .order('order', { ascending: true })

        if (itemsData) {
          const mappedItems: StatItem[] = itemsData.map((item: KeyStatisticsItemData) => ({
            id: String(item.id),
            value: item.value,
            label: item.label,
          }))
          setKeyStatisticsItems(mappedItems)
        }

        if (imagesData) {
          const mappedImages: StatImage[] = imagesData.map((img: KeyStatisticsImageData) => ({
            id: String(img.id),
            image: img.image,
            altText: img.alt_text,
          }))
          setKeyStatisticsImages(mappedImages)
        }
      }

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

      // Fetch goals section data
      const { data: goalsData, error: goalsError } = await supabase
        .from('goals_about_page')
        .select('*')
        .eq('is_active', true)
        .limit(1)
        .single()

      if (!goalsError && goalsData) {
        setGoalTitle(goalsData.title)

        // Fetch goal items
        const { data: goalItemsData } = await supabase
          .from('goals_items_about_page')
          .select('*')
          .eq('goals_id', goalsData.id)
          .order('order', { ascending: true })

        if (goalItemsData) {
          const mappedItems: GoalItem[] = goalItemsData.map((item: GoalItemData) => ({
            id: String(item.id),
            description: item.description,
          }))
          setGoalItems(mappedItems)
        }
      }

      // Fetch philosophy section data
      const { data: philosophyData, error: philosophyError } = await supabase
        .from('philosophy_about_page')
        .select('*')
        .eq('is_active', true)
        .limit(1)
        .single()

      if (!philosophyError && philosophyData) {
        setPhilosophyTitle(philosophyData.title)
        setPhilosophyDescription(philosophyData.description)
        setPhilosophyImage(philosophyData.image || '')
        setPhilosophyImageAlt(philosophyData.image_alt || '')
      }
    } catch (error) {
      console.error('Error fetching initial data:', error)
    }
  }

  const setupRealtimeSubscriptions = () => {
    // Subscribe to banner_about_page changes
    const bannerChannel = supabase
      .channel('banner_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'banner_about_page' },
        async () => {
          const { data, error } = await supabase
            .from('banner_about_page')
            .select('*')
            .eq('is_active', true)
            .limit(1)
            .single()

          if (!error && data) {
            setBannerBackgroundImage(data.background_image)
          }
        }
      )
      .subscribe()

    // Subscribe to key_statistics_about_page changes
    const keyStatsChannel = supabase
      .channel('key_statistics_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'key_statistics_about_page' },
        async () => {
          const { data, error } = await supabase
            .from('key_statistics_about_page')
            .select('*')
            .eq('is_active', true)
            .limit(1)
            .single()

          if (!error && data) {
            setKeyStatisticsTitle(data.title)
            setKeyStatisticsDescription(data.description)
          }
        }
      )
      .subscribe()

    // Subscribe to key_statistics_items changes
    const keyStatsItemsChannel = supabase
      .channel('key_statistics_items_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'key_statistics_items_about_page' },
        async () => {
          const { data: sectionData } = await supabase
            .from('key_statistics_about_page')
            .select('id')
            .eq('is_active', true)
            .limit(1)
            .single()

          if (sectionData?.id) {
            const { data: itemsData } = await supabase
              .from('key_statistics_items_about_page')
              .select('*')
              .eq('statistics_id', sectionData.id)
              .order('order', { ascending: true })

            if (itemsData) {
              const mappedItems: StatItem[] = itemsData.map((item: KeyStatisticsItemData) => ({
                id: String(item.id),
                value: item.value,
                label: item.label,
              }))
              setKeyStatisticsItems(mappedItems)
            }
          }
        }
      )
      .subscribe()

    // Subscribe to key_statistics_images changes
    const keyStatsImagesChannel = supabase
      .channel('key_statistics_images_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'key_statistics_images_about_page' },
        async () => {
          const { data: sectionData } = await supabase
            .from('key_statistics_about_page')
            .select('id')
            .eq('is_active', true)
            .limit(1)
            .single()

          if (sectionData?.id) {
            const { data: imagesData } = await supabase
              .from('key_statistics_images_about_page')
              .select('*')
              .eq('statistics_id', sectionData.id)
              .order('order', { ascending: true })

            if (imagesData) {
              const mappedImages: StatImage[] = imagesData.map((img: KeyStatisticsImageData) => ({
                id: String(img.id),
                image: img.image,
                altText: img.alt_text,
              }))
              setKeyStatisticsImages(mappedImages)
            }
          }
        }
      )
      .subscribe()

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

    // Subscribe to goals_about_page changes
    const goalsChannel = supabase
      .channel('goals_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'goals_about_page' },
        async () => {
          const { data, error } = await supabase
            .from('goals_about_page')
            .select('*')
            .eq('is_active', true)
            .limit(1)
            .single()

          if (!error && data) {
            setGoalTitle(data.title)
          }
        }
      )
      .subscribe()

    // Subscribe to goals_items changes
    const goalsItemsChannel = supabase
      .channel('goals_items_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'goals_items_about_page' },
        async () => {
          const { data: sectionData } = await supabase
            .from('goals_about_page')
            .select('id')
            .eq('is_active', true)
            .limit(1)
            .single()

          if (sectionData?.id) {
            const { data: itemsData } = await supabase
              .from('goals_items_about_page')
              .select('*')
              .eq('goals_id', sectionData.id)
              .order('order', { ascending: true })

            if (itemsData) {
              const mappedItems: GoalItem[] = itemsData.map((item: GoalItemData) => ({
                id: String(item.id),
                description: item.description,
              }))
              setGoalItems(mappedItems)
            }
          }
        }
      )
      .subscribe()

    // Subscribe to philosophy_about_page changes
    const philosophyChannel = supabase
      .channel('philosophy_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'philosophy_about_page' },
        async () => {
          const { data, error } = await supabase
            .from('philosophy_about_page')
            .select('*')
            .eq('is_active', true)
            .limit(1)
            .single()

          if (!error && data) {
            setPhilosophyTitle(data.title)
            setPhilosophyDescription(data.description)
            setPhilosophyImage(data.image || '')
            setPhilosophyImageAlt(data.image_alt || '')
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(bannerChannel)
      supabase.removeChannel(keyStatsChannel)
      supabase.removeChannel(keyStatsItemsChannel)
      supabase.removeChannel(keyStatsImagesChannel)
      supabase.removeChannel(whyChooseSectionChannel)
      supabase.removeChannel(whyChooseCardsChannel)
      supabase.removeChannel(goalsChannel)
      supabase.removeChannel(goalsItemsChannel)
      supabase.removeChannel(philosophyChannel)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <AboutBanner backgroundImageUrl={bannerBackgroundImage} />
      <AboutKeyStatistics
        title={keyStatisticsTitle}
        description={keyStatisticsDescription}
        items={keyStatisticsItems}
        images={keyStatisticsImages}
      />
      <AboutGoalsPhilosophy
        goalTitle={goalTitle}
        goalItems={goalItems}
        philosophyTitle={philosophyTitle}
        philosophyDescription={philosophyDescription}
        philosophyImage={philosophyImage}
        philosophyImageAlt={philosophyImageAlt}
      />
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
