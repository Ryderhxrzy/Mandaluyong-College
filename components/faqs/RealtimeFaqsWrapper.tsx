'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import FaqsHeroSection from '@/components/faqs/FaqsHeroSection'
import Faqs from '@/components/faqs/Faqs'

export default function RealtimeFaqsWrapper() {
  const [hero, setHero] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])

  const fetchHero = useCallback(async () => {
    const { data: heroData, error } = await supabase
      .from('faqs_hero')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single()
    if (!error && heroData) setHero(heroData)
  }, [])

  const fetchItems = useCallback(async () => {
    const { data: itemsData, error } = await supabase
      .from('faqs_items')
      .select('*')
      .order('order', { ascending: true })
    if (!error && itemsData) setItems(itemsData)
  }, [])

  const fetchAll = useCallback(async () => {
    await Promise.all([fetchHero(), fetchItems()])
  }, [fetchHero, fetchItems])

  useEffect(() => {
    fetchAll()

    const heroSub = supabase
      .channel('faqs_hero_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'faqs_hero' }, fetchHero)
      .subscribe()

    const itemsSub = supabase
      .channel('faqs_items_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'faqs_items' }, fetchItems)
      .subscribe()

    return () => {
      supabase.removeChannel(heroSub)
      supabase.removeChannel(itemsSub)
    }
  }, [fetchAll, fetchHero, fetchItems])

  return (
    <div className="min-h-screen bg-white">
      <div className="-mt-14 md:-mt-16">
        <FaqsHeroSection 
          title={hero?.title}
          subtitle={hero?.subtitle}
          description={hero?.description}
          icon={hero?.icon}
        />
      </div>
      <Faqs initialItems={items} />
    </div>
  )
}


