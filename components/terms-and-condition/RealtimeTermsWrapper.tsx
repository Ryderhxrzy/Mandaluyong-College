'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import TermsHeroSection from '@/components/terms-and-condition/TermsHeroSection'
import TermsAndCondition from '@/components/terms-and-condition/TermsAndCondition'

export default function RealtimeTermsWrapper() {
  const [hero, setHero] = useState<any>(null)
  const [sections, setSections] = useState<any[]>([])

  const fetchHero = useCallback(async () => {
    const { data, error } = await supabase
      .from('terms_and_conditions_hero')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single()
    if (!error && data) setHero(data)
  }, [])

  const fetchSections = useCallback(async () => {
    const { data, error } = await supabase
      .from('terms_and_conditions_sections')
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
      .channel('terms_hero_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'terms_and_conditions_hero' }, fetchHero)
      .subscribe()

    const sectionsSub = supabase
      .channel('terms_sections_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'terms_and_conditions_sections' }, fetchSections)
      .subscribe()

    return () => {
      supabase.removeChannel(heroSub)
      supabase.removeChannel(sectionsSub)
    }
  }, [fetchAll, fetchHero, fetchSections])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="-mt-14 md:-mt-16">
        <TermsHeroSection 
          title={hero?.title}
          subtitle={hero?.subtitle}
          description={hero?.description}
          icon={hero?.icon}
        />
      </div>
      <TermsAndCondition initialSections={sections} />
    </div>
  )
}
