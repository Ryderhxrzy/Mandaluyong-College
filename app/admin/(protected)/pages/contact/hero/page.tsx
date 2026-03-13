'use client'

import { useState, useEffect, useCallback } from 'react'
import { Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from 'next-cloudinary'
import ContactHeroSection from '@/components/contact/ContactHeroSection'

interface HeroData {
  id: string | null
  title: string
  subtitle: string
  logo_image: string
}

export default function ContactHeroAdmin() {
  const [loading, setLoading] = useState(true)
  const [heroData, setHeroData] = useState<HeroData>({
    id: null,
    title: "Let's Talk. Get in Touch with MCST",
    subtitle: 'Whether you are a student, parent, or guest, we are here to help.',
    logo_image: '/mcst-logo.png',
  })

  const [editingHeader, setEditingHeader] = useState(false)
  const [headerData, setHeaderData] = useState<HeroData>(heroData)
  const [isSaving, setIsSaving] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const heroRes = await fetch('/api/admin/contact/hero')

      if (heroRes.ok) {
        const hero = await heroRes.json()
        setHeroData(hero)
        setHeaderData(hero)
      }
    } catch (error) {
      console.error('Error fetching contact data:', error)
      toast.error('Failed to load contact data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSaveHeader = async () => {
    if (!headerData.title.trim() || !headerData.subtitle.trim()) {
      toast.error('Title and subtitle are required')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/contact/hero/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: headerData.title,
          subtitle: headerData.subtitle,
          logo_image: headerData.logo_image,
        }),
      })

      if (!response.ok) throw new Error('Failed to save hero')

      const updated = await response.json()
      setHeroData(updated)
      setEditingHeader(false)
      toast.success('Hero section updated successfully!')
    } catch (error) {
      console.error('Error saving hero:', error)
      toast.error('Failed to save hero section')
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageUpload = (results: CloudinaryUploadWidgetResults) => {
    if (
      results.event === 'success' &&
      results.info &&
      typeof results.info === 'object' &&
      'secure_url' in results.info
    ) {
      const imageUrl = (results.info as { secure_url: string }).secure_url
      setHeaderData({ ...headerData, logo_image: imageUrl })
      toast.success('Image uploaded successfully!')
    }
  }

  if (loading) {
    return (
      <div className="p-6 w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Contact - Hero Section
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
        Contact - Hero Section
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {editingHeader ? (
          <div className="p-6 space-y-6">
            {/* Edit Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <textarea
                  value={headerData.title}
                  onChange={(e) => setHeaderData({ ...headerData, title: e.target.value })}
                  placeholder="Enter title..."
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Subtitle
                </label>
                <textarea
                  value={headerData.subtitle}
                  onChange={(e) => setHeaderData({ ...headerData, subtitle: e.target.value })}
                  placeholder="Enter subtitle..."
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Logo Image URL
                  </label>
                  <input
                    type="text"
                    value={headerData.logo_image}
                    readOnly
                    placeholder="Image URL will appear here after upload"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white cursor-not-allowed opacity-60"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    This field is read-only. Use the upload button below to change the image.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Upload Logo Image
                  </label>
                  <CldUploadWidget
                    onSuccess={handleImageUpload}
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                  >
                    {({ open }) => (
                      <button
                        onClick={() => open()}
                        className="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Upload size={18} /> Upload New Logo
                      </button>
                    )}
                  </CldUploadWidget>
                </div>
              </div>
            </div>

            {/* Live Preview */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Live Preview
              </h2>
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                <ContactHeroSection
                  title={headerData.title}
                  subtitle={headerData.subtitle}
                  logoImage={headerData.logo_image}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setEditingHeader(false)
                  setHeaderData(heroData)
                }}
                className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveHeader}
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
              Current Layout (From Database)
            </h2>
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
              <ContactHeroSection
                title={heroData.title}
                subtitle={heroData.subtitle}
                logoImage={heroData.logo_image}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end border-t border-gray-200 dark:border-gray-700 pt-6">
              <button
                onClick={() => setEditingHeader(true)}
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
