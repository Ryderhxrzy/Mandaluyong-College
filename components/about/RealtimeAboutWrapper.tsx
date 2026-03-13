'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AboutBanner from '@/components/about/AboutBanner'
import AboutKeyStatistics, { StatItem, StatImage } from '@/components/about/AboutKeyStatistics'
import AboutGoalsPhilosophy, { GoalItem } from '@/components/about/AboutGoalsPhilosophy'
import AboutMissionVision from '@/components/about/AboutMissionVision'
import AboutCoreValuesSection, { CoreValueItem } from '@/components/about/AboutCoreValuesSection'
import AboutWhyChoose, { WhyChooseCard } from '@/components/about/AboutWhyChoose'
import AboutJoinCommunity, { JoinCommunityImage } from '@/components/about/AboutJoinCommunity'

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

interface CoreValueItemData {
  id: number
  name: string
  description: string
}

interface JoinCommunityImageData {
  id: number
  image: string
  alt_text: string
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
  const [keyStatisticsItems, setKeyStatisticsItems] = useState<StatItem[]>([
    { id: '1', value: '420+', label: 'Students enrolled in diverse academic programs.' },
    { id: '2', value: '20+', label: 'Dedicated faculty and staff supporting student success.' },
  ])
  const [keyStatisticsImages, setKeyStatisticsImages] = useState<StatImage[]>([
    { id: '1', image: '/1.webp', altText: 'MCST Campus Life' },
    { id: '2', image: '/2.webp', altText: 'MCST Students' },
    { id: '3', image: '/3.webp', altText: 'MCST Community' },
    { id: '4', image: '/4.webp', altText: 'MCST Excellence' },
  ])

  // Why Choose Section State
  const [whyChooseTitle, setWhyChooseTitle] = useState(initialWhyChooseTitle)
  const [whyChooseSubtitle, setWhyChooseSubtitle] = useState(initialWhyChooseSubtitle)
  const [whyChooseCards, setWhyChooseCards] = useState<WhyChooseCard[]>(initialWhyChooseCards)

  // Goals Section State
  const [goalTitle, setGoalTitle] = useState('Goals')
  const [goalItems, setGoalItems] = useState<GoalItem[]>([])

  // Philosophy Section State
  const [philosophyTitle, setPhilosophyTitle] = useState('Philosophy')
  const [philosophyDescription, setPhilosophyDescription] = useState('Mandaluyong College of Science and Technology advocates the culture of excellence in science and technology that is anchored on the principles of quality instruction, dynamic research and innovation, continuous improvement, public service, and nationalism.')
  const [philosophyImage, setPhilosophyImage] = useState('/goals.jpg')
  const [philosophyImageAlt, setPhilosophyImageAlt] = useState('MCST Goals')

  // Mission & Vision Section State
  const [mission, setMission] = useState('To cultivate a culture of excellence in Science and Technology pursuing the improvement of the quality of life of every Mandaleño to bring about the city\'s sustainable development and resiliency towards nation building.')
  const [vision, setVision] = useState('A college of distinction in Science and Technology committed to produce high caliber and employable graduates.')

  // Core Values Section State
  const [coreValuesTitle, setCoreValuesTitle] = useState('Mandaluyong College of Science and Technology')
  const [coreValuesDescription, setCoreValuesDescription] = useState('MCST Core Values represent the shared beliefs of the Mandaleño. These beliefs define a genuine Mandaleño through six key ideals:')
  const [coreValuesImage, setCoreValuesImage] = useState('/mcst-core.jpg')
  const [coreValuesCampusTitle, setCoreValuesCampusTitle] = useState('Our Campus')
  const [coreValuesCampusDescription, setCoreValuesCampusDescription] = useState('A center of excellence fostering academic growth, character development, and community service in the heart of Mandaluyong.')
  const [coreValuesItems, setCoreValuesItems] = useState<CoreValueItem[]>([])

  // Join Community Section State
  const [joinCommunityTitle, setJoinCommunityTitle] = useState('Advancing Science.\nEmpowering Mandaleños.')
  const [joinCommunityDescription, setJoinCommunityDescription] = useState('At Mandaluyong College of Science and Technology, we champion excellence in instruction, innovation, and inclusive education. Our commitment is rooted in public service, research, and producing globally competitive graduates with a strong sense of nationalism. Be part of a future-forward institution shaping the leaders of tomorrow.')
  const [joinCommunityImages, setJoinCommunityImages] = useState<JoinCommunityImage[]>([])

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

      // Fetch mission & vision section data
      const { data: missionVisionData, error: missionVisionError } = await supabase
        .from('mission_vision_about_page')
        .select('*')
        .eq('is_active', true)
        .limit(1)
        .single()

      if (!missionVisionError && missionVisionData) {
        setMission(missionVisionData.mission)
        setVision(missionVisionData.vision)
      }

      // Fetch core values section data
      const { data: coreValuesData, error: coreValuesError } = await supabase
        .from('core_values_about_page')
        .select('*')
        .eq('is_active', true)
        .limit(1)
        .single()

      if (!coreValuesError && coreValuesData) {
        setCoreValuesTitle(coreValuesData.title)
        setCoreValuesDescription(coreValuesData.description)
        setCoreValuesImage(coreValuesData.image || '/mcst-core.jpg')
        setCoreValuesCampusTitle(coreValuesData.campus_title)
        setCoreValuesCampusDescription(coreValuesData.campus_description)

        // Fetch core values items
        const { data: coreValuesItemsData } = await supabase
          .from('core_values_items_about_page')
          .select('*')
          .eq('core_values_id', coreValuesData.id)
          .order('order', { ascending: true })

        if (coreValuesItemsData) {
          const mappedItems: CoreValueItem[] = coreValuesItemsData.map((item: CoreValueItemData) => ({
            id: String(item.id),
            name: item.name,
            description: item.description,
          }))
          setCoreValuesItems(mappedItems)
        }
      }

      // Fetch join community section data
      const { data: joinCommunityData, error: joinCommunityError } = await supabase
        .from('join_community_about_page')
        .select('*')
        .eq('is_active', true)
        .limit(1)
        .single()

      if (!joinCommunityError && joinCommunityData) {
        setJoinCommunityTitle(joinCommunityData.title)
        setJoinCommunityDescription(joinCommunityData.description)

        // Fetch join community images
        const { data: joinCommunityImagesData } = await supabase
          .from('join_community_images_about_page')
          .select('*')
          .eq('join_community_id', joinCommunityData.id)
          .order('order', { ascending: true })

        if (joinCommunityImagesData) {
          const mappedImages: JoinCommunityImage[] = joinCommunityImagesData.map((img: JoinCommunityImageData) => ({
            id: String(img.id),
            image: img.image,
            altText: img.alt_text,
          }))
          setJoinCommunityImages(mappedImages)
        }
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

    // Subscribe to mission_vision_about_page changes
    const missionVisionChannel = supabase
      .channel('mission_vision_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'mission_vision_about_page' },
        async () => {
          const { data, error } = await supabase
            .from('mission_vision_about_page')
            .select('*')
            .eq('is_active', true)
            .limit(1)
            .single()

          if (!error && data) {
            setMission(data.mission)
            setVision(data.vision)
          }
        }
      )
      .subscribe()

    // Subscribe to core_values_about_page changes
    const coreValuesChannel = supabase
      .channel('core_values_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'core_values_about_page' },
        async () => {
          const { data, error } = await supabase
            .from('core_values_about_page')
            .select('*')
            .eq('is_active', true)
            .limit(1)
            .single()

          if (!error && data) {
            setCoreValuesTitle(data.title)
            setCoreValuesDescription(data.description)
            setCoreValuesImage(data.image || '/mcst-core.jpg')
            setCoreValuesCampusTitle(data.campus_title)
            setCoreValuesCampusDescription(data.campus_description)
          }
        }
      )
      .subscribe()

    // Subscribe to core_values_items changes
    const coreValuesItemsChannel = supabase
      .channel('core_values_items_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'core_values_items_about_page' },
        async () => {
          const { data: sectionData } = await supabase
            .from('core_values_about_page')
            .select('id')
            .eq('is_active', true)
            .limit(1)
            .single()

          if (sectionData?.id) {
            const { data: itemsData } = await supabase
              .from('core_values_items_about_page')
              .select('*')
              .eq('core_values_id', sectionData.id)
              .order('order', { ascending: true })

            if (itemsData) {
              const mappedItems: CoreValueItem[] = itemsData.map((item: CoreValueItemData) => ({
                id: String(item.id),
                name: item.name,
                description: item.description,
              }))
              setCoreValuesItems(mappedItems)
            }
          }
        }
      )
      .subscribe()

    // Subscribe to join_community_about_page changes
    const joinCommunityChannel = supabase
      .channel('join_community_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'join_community_about_page' },
        async () => {
          const { data, error } = await supabase
            .from('join_community_about_page')
            .select('*')
            .eq('is_active', true)
            .limit(1)
            .single()

          if (!error && data) {
            setJoinCommunityTitle(data.title)
            setJoinCommunityDescription(data.description)
          }
        }
      )
      .subscribe()

    // Subscribe to join_community_images changes
    const joinCommunityImagesChannel = supabase
      .channel('join_community_images_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'join_community_images_about_page' },
        async () => {
          const { data: sectionData } = await supabase
            .from('join_community_about_page')
            .select('id')
            .eq('is_active', true)
            .limit(1)
            .single()

          if (sectionData?.id) {
            const { data: imagesData } = await supabase
              .from('join_community_images_about_page')
              .select('*')
              .eq('join_community_id', sectionData.id)
              .order('order', { ascending: true })

            if (imagesData) {
              const mappedImages: JoinCommunityImage[] = imagesData.map((img: JoinCommunityImageData) => ({
                id: String(img.id),
                image: img.image,
                altText: img.alt_text,
              }))
              setJoinCommunityImages(mappedImages)
            }
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
      supabase.removeChannel(missionVisionChannel)
      supabase.removeChannel(coreValuesChannel)
      supabase.removeChannel(coreValuesItemsChannel)
      supabase.removeChannel(joinCommunityChannel)
      supabase.removeChannel(joinCommunityImagesChannel)
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
      <AboutMissionVision mission={mission} vision={vision} />
      <AboutCoreValuesSection
        title={coreValuesTitle}
        description={coreValuesDescription}
        image={coreValuesImage}
        campusTitle={coreValuesCampusTitle}
        campusDescription={coreValuesCampusDescription}
        items={coreValuesItems}
      />
      <AboutWhyChoose
        title={whyChooseTitle}
        subtitle={whyChooseSubtitle}
        cards={whyChooseCards}
      />
      <AboutJoinCommunity
        title={joinCommunityTitle}
        description={joinCommunityDescription}
        images={joinCommunityImages}
      />
    </div>
  )
}
