'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from 'next-cloudinary'
import NewsBanner from '@/components/news/NewsBanner'

interface BannerSettings {
  id: number
  image_url: string
  is_active: boolean
}

export default function BannerContent() {
  const [banner, setBanner] = useState<BannerSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    fetchBanner()
    setupRealtimeSubscription()
  }, [])

  const fetchBanner = async () => {
    try {
      const response = await fetch('/api/news/banner')
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setBanner(data)
          setImageUrl(data.image_url || '')
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
      .channel('news_banner_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'news_banner' },
        () => {
          fetchBanner()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const handleCloudinaryUpload = (results: CloudinaryUploadWidgetResults) => {
    if (
      results.event === 'success' &&
      results.info &&
      typeof results.info === 'object' &&
      'secure_url' in results.info
    ) {
      const url = (results.info as { secure_url: string }).secure_url
      setImageUrl(url)
      toast.success('Image uploaded successfully!')
    }
  }

  const handleSave = async () => {
    if (!imageUrl.trim()) {
      toast.error('Please upload a banner image')
      return
    }

    setIsSaving(true)
    try {
      if (banner) {
        const response = await fetch(`/api/admin/news/banner/${banner.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image_url: imageUrl }),
        })

        if (response.ok) {
          toast.success('Banner updated successfully')
          setIsEditing(false)
          fetchBanner()
        } else {
          toast.error('Failed to update banner')
        }
      }
    } catch (error) {
      console.error('Error saving banner:', error)
      toast.error('Error saving banner')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setImageUrl(banner?.image_url || '')
    setIsEditing(false)
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
            href="/admin/pages/news"
            className="flex items-center gap-2 text-primary hover:text-[#003a7a] transition mb-4"
          >
            <ArrowLeft size={18} />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">News Banner</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage the news page banner image</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {isEditing ? (
            <div className="p-6 space-y-6">
              {/* Cloudinary Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  Banner Image
                </label>
                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                  onSuccess={handleCloudinaryUpload}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open()}
                      className="w-full px-4 py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition flex items-center justify-center gap-3 cursor-pointer"
                    >
                      <Upload size={20} />
                      <div className="text-left">
                        <p className="font-medium">{imageUrl ? 'Change Image' : 'Click to upload image'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Supported formats: JPG, PNG, GIF, WebP
                        </p>
                      </div>
                    </button>
                  )}
                </CldUploadWidget>
              </div>

              {/* Preview */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Preview
                </label>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <NewsBanner backgroundImageUrl={imageUrl || '/banner.jpg'} />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-400 dark:hover:bg-gray-500 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Preview</h2>
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                <NewsBanner backgroundImageUrl={imageUrl || '/banner.jpg'} />
              </div>

              <div className="flex justify-end border-t border-gray-200 dark:border-gray-700 pt-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition cursor-pointer"
                >
                  Edit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
