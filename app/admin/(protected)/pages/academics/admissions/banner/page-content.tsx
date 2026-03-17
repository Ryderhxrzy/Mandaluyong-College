'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

interface BannerSettings {
  id: number
  section_name: string
  banner_image_url: string | null
  title: string | null
  subtitle: string | null
  is_active: boolean
}

export default function BannerContent() {
  const [banner, setBanner] = useState<BannerSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    banner_image_url: '',
    title: '',
    subtitle: '',
  })

  useEffect(() => {
    fetchBanner()
    setupRealtimeSubscription()
  }, [])

  const fetchBanner = async () => {
    try {
      const response = await fetch('/api/admissions/banner-settings')
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setBanner(data)
          setFormData({
            banner_image_url: data.banner_image_url || '',
            title: data.title || '',
            subtitle: data.subtitle || '',
          })
        }
      }
    } catch (error) {
      console.error('Error fetching banner:', error)
      toast.error('Failed to load banner settings')
    } finally {
      setIsLoading(false)
    }
  }

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('admissions_banner_settings_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'admissions_banner_settings' },
        () => {
          fetchBanner()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      if (banner) {
        const response = await fetch(`/api/admin/admissions/banner-settings/${banner.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          toast.success('Banner settings updated')
          fetchBanner()
        } else {
          toast.error('Failed to update banner settings')
        }
      }
    } catch (error) {
      console.error('Error saving banner:', error)
      toast.error('Error saving banner settings')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <Link
            href="/admin/pages/academics/admissions"
            className="flex items-center gap-2 text-primary hover:text-[#003a7a] transition mb-4"
          >
            <ArrowLeft size={18} />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admissions Banner</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage the admissions page banner</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preview Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="relative h-80">
                {formData.banner_image_url ? (
                  <Image
                    src={formData.banner_image_url}
                    alt="Banner preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">No image uploaded</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  {formData.title && <h1 className="text-4xl font-bold mb-2">{formData.title}</h1>}
                  {formData.subtitle && <p className="text-lg text-center max-w-2xl">{formData.subtitle}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-fit">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Banner Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Banner Image URL</label>
                <input
                  type="url"
                  value={formData.banner_image_url}
                  onChange={(e) => setFormData({ ...formData, banner_image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Enter the full URL of the banner image</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Admissions"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subtitle</label>
                <textarea
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Enter banner subtitle"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save size={18} />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
