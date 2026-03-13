'use client'

import React, { useState, useEffect } from 'react'
import { Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from 'next-cloudinary'
import AboutBanner from '@/components/about/AboutBanner'

interface BannerSection {
  id: number
  background_image: string
  is_active: boolean
}

export default function AboutBannerPage() {
  const [bannerData, setBannerData] = useState<BannerSection>({
    id: 0,
    background_image: '/banner.jpg',
    is_active: true,
  })
  const [isEditing, setIsEditing] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchBannerData()
  }, [])

  const fetchBannerData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/about/banner`)
      const data = await response.json()

      if (response.ok && data && data.id) {
        setBannerData({
          id: data.id,
          background_image: data.background_image,
          is_active: data.is_active,
        })
      } else {
        // Use default fallback
        setBannerData({
          id: 0,
          background_image: '/banner.jpg',
          is_active: true,
        })
      }
    } catch (error) {
      console.error('Error fetching banner data:', error)
      // Use default fallback on error
      setBannerData({
        id: 0,
        background_image: '/banner.jpg',
        is_active: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloudinaryUpload = (results: CloudinaryUploadWidgetResults) => {
    if (
      results.event === 'success' &&
      results.info &&
      typeof results.info === 'object' &&
      'secure_url' in results.info
    ) {
      const imageUrl = (results.info as { secure_url: string }).secure_url
      setUploadedImage(imageUrl)
      setBannerData(prev => ({
        ...prev,
        background_image: imageUrl,
      }))
      toast.success('Image uploaded successfully!')
    }
  }

  const handleSave = async () => {
    if (!bannerData.background_image.trim()) {
      toast.error('Please provide a background image')
      return
    }

    setIsSaving(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/about/banner/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          background_image: bannerData.background_image,
          is_active: true,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Banner saved successfully!')
        setIsEditing(false)
        setBannerData(data.data)
      } else {
        toast.error(data.error || 'Failed to save banner')
      }
    } catch (error) {
      console.error('Error saving banner:', error)
      toast.error('An error occurred while saving')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setUploadedImage(null)
    setIsEditing(false)
    fetchBannerData()
  }

  if (isLoading) {
    return (
      <div className="p-6 w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Banner Section
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Banner Section
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {isEditing ? (
          <div className="p-6 space-y-6">
            {/* Image Upload - Cloudinary */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Banner Background Image
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
                      <p className="font-medium">{uploadedImage ? 'Change Image' : 'Click to upload image'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Supported formats: JPG, PNG, GIF, WebP
                      </p>
                    </div>
                  </button>
                )}
              </CldUploadWidget>
            </div>

            {/* Image Preview */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Preview
              </label>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <AboutBanner backgroundImageUrl={bannerData.background_image} />
              </div>
            </div>

            {/* Action Buttons */}
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
                className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Preview
            </h2>
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
              <AboutBanner backgroundImageUrl={bannerData.background_image} />
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
          </div>
        )}
      </div>
    </div>
  )
}
