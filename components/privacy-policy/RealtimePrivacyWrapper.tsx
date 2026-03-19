'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import PrivacyHeroSection from '@/components/privacy-policy/PrivacyHeroSection'
import PrivacyPolicy from '@/components/privacy-policy/PrivacyPolicy'

export default function RealtimePrivacyWrapper() {
  const [hero, setHero] = useState<any>(null)
  const [sections, setSections] = useState<any[]>([])

  const fetchHero = useCallback(async () => {
    const { data, error } = await supabase
      .from('privacy_policy_hero')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single()
    if (!error && data) setHero(data)
  }, [])

  const fetchSections = useCallback(async () => {
    const { data, error } = await supabase
      .from('privacy_policy_sections')
      .select('*')
      .eq('is_active', true)
      .order('order', { ascending: true })
    if (!error && data) setSections(data)
  }, [])

  const fetchAll = useCallback(async () => {
    await Promise.all([fetchHero(), fetchSections()])
  }, [fetchHero, fetchSections])

  useEffect(() => {
    fetchAll()

    const heroSub = supabase
      .channel('privacy_hero_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'privacy_policy_hero' }, fetchHero)
      .subscribe()

    const sectionsSub = supabase
      .channel('privacy_sections_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'privacy_policy_sections' }, fetchSections)
      .subscribe()

    return () => {
      supabase.removeChannel(heroSub)
      supabase.removeChannel(sectionsSub)
    }
  }, [fetchAll, fetchHero, fetchSections])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="-mt-14 md:-mt-16">
        <PrivacyHeroSection 
          title={hero?.title}
          subtitle={hero?.subtitle}
          description={hero?.description}
          icon={hero?.icon}
        />
      </div>
      <PrivacyPolicy initialSections={sections} />
    </div>
  )
}
