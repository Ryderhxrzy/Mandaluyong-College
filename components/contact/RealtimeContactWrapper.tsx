'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import ContactHeroSection from '@/components/contact/ContactHeroSection'
import ContactInfoSection from '@/components/contact/ContactInfoSection'

interface ContactItem {
  id: string
  type: string
  label: string
  content: string
}

interface HeroData {
  id: string | null
  title: string
  subtitle: string
  logo_image: string
}

interface InfoData {
  id: string | null
  section_image: string
  items: ContactItem[]
}

export default function RealtimeContactWrapper() {
  const [heroData, setHeroData] = useState<HeroData>({
    id: null,
    title: "Let's Talk. Get in Touch with MCST",
    subtitle: 'Whether you are a student, parent, or guest, we are here to help.',
    logo_image: '/mcst-logo.png',
  })

  const [infoData, setInfoData] = useState<InfoData>({
    id: null,
    section_image: '/join2.jpg',
    items: [],
  })

  const fetchData = useCallback(async () => {
    try {
      const [heroResponse, infoResponse] = await Promise.all([
        fetch('/api/admin/contact/hero'),
        fetch('/api/admin/contact/info'),
      ])

      if (heroResponse.ok) {
        const hero = await heroResponse.json()
        setHeroData(hero)
      }

      if (infoResponse.ok) {
        const info = await infoResponse.json()
        setInfoData(info)
      }
    } catch (error) {
      console.error('Error fetching contact data:', error)
    }
  }, [])

  const setupRealtimeSubscriptions = useCallback(() => {
    // Subscribe to hero changes
    const heroChannel = supabase
      .channel('contact_hero_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contact_page_hero' },
        async () => {
          const response = await fetch('/api/admin/contact/hero')
          if (response.ok) {
            const hero = await response.json()
            setHeroData(hero)
          }
        }
      )
      .subscribe()

    // Subscribe to info changes
    const infoChannel = supabase
      .channel('contact_info_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contact_page_info' },
        async () => {
          const response = await fetch('/api/admin/contact/info')
          if (response.ok) {
            const info = await response.json()
            setInfoData(info)
          }
        }
      )
      .subscribe()

    // Subscribe to info items changes
    const itemsChannel = supabase
      .channel('contact_info_items_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contact_page_info_items' },
        async () => {
          const response = await fetch('/api/admin/contact/info')
          if (response.ok) {
            const info = await response.json()
            setInfoData(info)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(heroChannel)
      supabase.removeChannel(infoChannel)
      supabase.removeChannel(itemsChannel)
    }
  }, [])

  useEffect(() => {
    fetchData()
    return setupRealtimeSubscriptions()
  }, [fetchData, setupRealtimeSubscriptions])

  return (
    <div className="min-h-screen bg-white">
      <div className="-mt-14 md:-mt-16">
        <ContactHeroSection
          title={heroData.title}
          subtitle={heroData.subtitle}
          logoImage={heroData.logo_image}
        />
        <ContactInfoSection
          items={infoData.items}
          sectionImage={infoData.section_image}
        />
      </div>
    </div>
  )
}
