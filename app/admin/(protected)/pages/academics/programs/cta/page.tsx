'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import ProgramsCTA from '@/components/academics/programs/ProgramsCTA'

export default function ProgramsCTAPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [ctaTitle, setCtaTitle] = useState('Elevate Your Future With Mandaluyong College of Science and Technology')
  const [ctaSubtitle, setCtaSubtitle] = useState('Whether you\'re aiming to innovate, lead, serve, or create—your journey starts here. Our programs are designed to not just prepare you for a job, but to shape you into a visionary ready to transform the world.')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load CTA data on mount
  useEffect(() => {
    const loadCTA = async () => {
      try {
        const response = await fetch('/api/admin/programs/cta')
        if (response.ok) {
          const data = await response.json()
          console.log('Loaded CTA:', data)
          if (data.title) setCtaTitle(data.title)
          if (data.subtitle) setCtaSubtitle(data.subtitle)
        }
      } catch (error) {
        console.error('Error loading CTA:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadCTA()
  }, [])

  // Real-time subscription for CTA changes
  useEffect(() => {
    const channel = supabase
      .channel('cta_section_updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'programs_cta_section' },
        async () => {
          console.log('CTA updated, reloading...')
          const response = await fetch('/api/admin/programs/cta')
          if (response.ok) {
            const data = await response.json()
            if (data.title) setCtaTitle(data.title)
            if (data.subtitle) setCtaSubtitle(data.subtitle)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleSaveCTA = async () => {
    if (!ctaTitle.trim() || !ctaSubtitle.trim()) {
      toast.error('CTA title and subtitle are required')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/programs/cta/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: ctaTitle, subtitle: ctaSubtitle }),
      })

      if (response.ok) {
        toast.success('CTA section updated successfully!')
        setIsEditing(false)
      } else {
        toast.error('Failed to update CTA section')
      }
    } catch (error) {
      console.error('Error saving CTA:', error)
      toast.error('An error occurred while saving')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">CTA Section</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        CTA Section
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {isEditing ? (
          <>
            {/* Grid Layout: Form (left) and Preview (right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Left: Form Inputs */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={ctaTitle}
                    onChange={(e) => setCtaTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Subtitle
                  </label>
                  <textarea
                    value={ctaSubtitle}
                    onChange={(e) => setCtaSubtitle(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Right: Preview */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Preview
                </h2>
                <ProgramsCTA title={ctaTitle} subtitle={ctaSubtitle} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end border-t border-gray-200 dark:border-gray-700 pt-6">
              <button
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
                className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-400 dark:hover:bg-gray-500 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCTA}
                disabled={isSaving}
                className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Preview */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Preview
              </h2>
              <ProgramsCTA title={ctaTitle} subtitle={ctaSubtitle} />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end border-t border-gray-200 dark:border-gray-700 pt-6">
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition cursor-pointer"
              >
                Edit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
