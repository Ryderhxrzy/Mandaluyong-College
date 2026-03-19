'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import NewsBanner from '@/components/news/NewsBanner'
import LatestAnnouncements from '@/components/news/LatestAnnouncements'
import NewsCTA from '@/components/news/NewsCTA'

export default function RealtimeNewsWrapper() {
  const [banner, setBanner] = useState<any>(null)
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [cta, setCTA] = useState<any>(null)

  const fetchBanner = useCallback(async () => {
    const { data, error } = await supabase
      .from('news_banner')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single()
    if (!error && data) setBanner(data)
  }, [])

  const fetchAnnouncements = useCallback(async () => {
    const { data, error } = await supabase
      .from('news_announcements')
      .select('*')
      .eq('is_active', true)
      .order('order', { ascending: true })
    if (!error && data) setAnnouncements(data)
  }, [])

  const fetchCTA = useCallback(async () => {
    const { data, error } = await supabase
      .from('news_cta')
      .select(`
        *,
        news_cta_images (
          id,
          image_url,
          order
        )
      `)
      .eq('is_active', true)
      .limit(1)
      .single()
    if (!error && data) setCTA(data)
  }, [])

  const fetchAll = useCallback(async () => {
    // Initial fetch can use the API (which might be cached but that's okay for first load)
    // or just fetch everything directly from Supabase
    await Promise.all([
      fetchBanner(),
      fetchAnnouncements(),
      fetchCTA()
    ])
  }, [fetchBanner, fetchAnnouncements, fetchCTA])

  useEffect(() => {
    fetchAll()

    const bannerSub = supabase
      .channel('news_banner_public')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'news_banner' }, fetchBanner)
      .subscribe()

    const annSub = supabase
      .channel('news_announcements_public')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'news_announcements' }, fetchAnnouncements)
      .subscribe()

    const ctaSub = supabase
      .channel('news_cta_public')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'news_cta' }, fetchCTA)
      .subscribe()

    const ctaImagesSub = supabase
      .channel('news_cta_images_public')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'news_cta_images' }, fetchCTA)
      .subscribe()

    return () => {
      supabase.removeChannel(bannerSub)
      supabase.removeChannel(annSub)
      supabase.removeChannel(ctaSub)
      supabase.removeChannel(ctaImagesSub)
    }
  }, [fetchAll, fetchBanner, fetchAnnouncements, fetchCTA])

  return (
    <>
      <NewsBanner backgroundImageUrl={banner?.image_url} />
      <LatestAnnouncements initialAnnouncements={announcements} />
      <NewsCTA
        title={cta?.title}
        description={cta?.description}
        buttonText={cta?.button_text}
        buttonLink={cta?.button_link}
        images={cta?.news_cta_images}
      />
    </>
  )
}

