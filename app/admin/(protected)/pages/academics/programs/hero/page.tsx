'use client'

import { useState, useEffect } from 'react'
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from 'next-cloudinary'
import { Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import ProgramsBanner from '@/components/academics/programs/ProgramsBanner'

export default function ProgramsHeroPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [heroImageUrl, setHeroImageUrl] = useState('/banner.jpg')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load hero data on mount
  useEffect(() => {
    const loadHero = async () => {
      try {
        const response = await fetch('/api/admin/programs/hero')
        if (response.ok) {
          const data = await response.json()
          console.log('Loaded hero:', data)
          if (data.imageUrl) setHeroImageUrl(data.imageUrl)
        }
      } catch (error) {
        console.error('Error loading hero:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadHero()
  }, [])

  // Real-time subscription for hero changes
  useEffect(() => {
    const channel = supabase
      .channel('hero_section_updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'programs_banner' },
        async () => {
          console.log('Hero updated, reloading...')
          const response = await fetch('/api/admin/programs/hero')
          if (response.ok) {
            const data = await response.json()
            if (data.imageUrl) setHeroImageUrl(data.imageUrl)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleSaveHero = async () => {
    if (!heroImageUrl.trim()) {
      toast.error('Hero image is required')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/programs/hero/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: heroImageUrl }),
      })

      if (response.ok) {
        toast.success('Hero section updated successfully!')
        setIsEditing(false)
      } else {
        toast.error('Failed to update hero section')
      }
    } catch (error) {
      console.error('Error saving hero:', error)
      toast.error('An error occurred while saving')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Hero Section</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Hero Section
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {isEditing ? (
          <>
            {/* Grid Layout: Form (left) and Preview (right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Left: Form Inputs */}
              <div className="space-y-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Upload Hero Image
                </label>
                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                  onSuccess={(results: CloudinaryUploadWidgetResults) => {
                    if (
                      results.event === 'success' &&
                      results.info &&
                      typeof results.info === 'object' &&
                      'secure_url' in results.info
                    ) {
                      const imageUrl = (results.info as { secure_url: string }).secure_url
                      setHeroImageUrl(imageUrl)
                    }
                  }}
                >
                  {({ open }) => (
                    <button
                      onClick={() => open()}
                      className="w-full px-4 py-3 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center justify-center gap-2 cursor-pointer transition"
                    >
                      <Upload size={20} />
                      {heroImageUrl ? 'Change Image' : 'Upload Image'}
                    </button>
                  )}
                </CldUploadWidget>
              </div>

              {/* Right: Preview */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Preview
                </h2>
                <ProgramsBanner backgroundImageUrl={heroImageUrl} />
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
                onClick={handleSaveHero}
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
              <ProgramsBanner />
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
