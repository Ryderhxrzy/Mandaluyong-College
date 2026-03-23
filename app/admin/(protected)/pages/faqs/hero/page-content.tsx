'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import FaqsHeroSection from '@/components/faqs/FaqsHeroSection'
import IconPicker from '@/components/admin/IconPicker'
import * as LucideIcons from 'lucide-react'
import React from 'react'

interface HeroData {
  id: number
  title: string
  subtitle: string
  description: string
  icon: string
  is_active: boolean
}

export default function FaqsHeroContent() {
  const [hero, setHero] = useState<HeroData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    icon: ''
  })

  useEffect(() => {
    fetchHero()

    // Setup Realtime
    const channel = supabase
      .channel('faqs_hero_admin_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'faqs_hero' }, fetchHero)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchHero = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs_hero')
        .select('*')
        .limit(1)
        .single()

      if (!error && data) {
        setHero(data)
        setFormData({
          title: data.title || '',
          subtitle: data.subtitle || '',
          description: data.description || '',
          icon: data.icon || 'HelpCircle'
        })
      }
    } catch (error) {
      console.error('Error fetching hero:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!hero) return
    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/faqs/hero/${hero.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Hero section updated successfully')
        setIsEditing(false)
        fetchHero()
      } else {
        toast.error('Failed to update hero section')
      }
    } catch (error) {
      toast.error('Error saving updates')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (hero) {
      setFormData({
        title: hero.title || '',
        subtitle: hero.subtitle || '',
        description: hero.description || '',
        icon: hero.icon || 'HelpCircle'
      })
    }
    setIsEditing(false)
  }

  if (isLoading) return <div className="p-8 text-gray-900 dark:text-white">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <Link
            href="/admin/pages/faqs"
            className="flex items-center gap-2 text-primary hover:text-[#003a7a] transition font-medium mb-4"
          >
            <ArrowLeft size={18} />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-sans">FAQs Hero Section</h1>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Manage the main header content of the FAQs page</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {isEditing ? (
            <div className="p-6 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Inputs */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-tight">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-tight">Subtitle</label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-tight">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-tight">Section Icon</label>
                    <button
                      type="button"
                      onClick={() => setIsPickerOpen(true)}
                      className="w-full px-4 py-3 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition flex items-center justify-between cursor-pointer h-12"
                    >
                      <div className="flex items-center gap-3">
                        {/* @ts-ignore */}
                        {React.createElement(LucideIcons[formData.icon] || LucideIcons.HelpCircle, { size: 24, className: 'text-primary' })}
                        <span className="font-medium">{formData.icon || 'Choose an icon...'}</span>
                      </div>
                      <Search size={18} className="text-gray-400" />
                    </button>
                    <p className="text-xs text-gray-500 mt-2 font-medium italic">Click to open icon picker and search for any Lucide icon</p>
                  </div>
                </div>

                {/* Right: Preview */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-tight">Preview</label>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
                    <FaqsHeroSection
                      title={formData.title}
                      subtitle={formData.subtitle}
                      description={formData.description}
                      icon={formData.icon}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-400 dark:hover:bg-gray-500 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Preview</h2>
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                <FaqsHeroSection
                  title={formData.title}
                  subtitle={formData.subtitle}
                  description={formData.description}
                  icon={formData.icon}
                />
              </div>
              <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-8 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition cursor-pointer"
                >
                  Edit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isPickerOpen && (
        <IconPicker
          selectedIcon={formData.icon}
          onSelect={(name) => {
            setFormData({ ...formData, icon: name })
            setIsPickerOpen(false)
          }}
          onClose={() => setIsPickerOpen(false)}
        />
      )}
    </div>
  )
}
