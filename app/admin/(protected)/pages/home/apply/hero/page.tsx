'use client'

import { useState, useEffect } from 'react'
import { Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from 'next-cloudinary'
import ApplyHeroSection from '@/components/apply/ApplyHeroSection'

interface HeroSectionData {
  id: number
  title: string
  subtitle: string
  description: string
  logo_image: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function ApplyHeroPage() {
  const [data, setData] = useState<HeroSectionData | null>(null)
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [description, setDescription] = useState('')
  const [logoImage, setLogoImage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/apply/hero`)

      if (response.ok) {
        const result = await response.json()
        if (result?.id) {
          setData(result)
          setTitle(result.title)
          setSubtitle(result.subtitle)
          setDescription(result.description)
          setLogoImage(result.logo_image)
        }
      } else {
        // Use mock data if API endpoint doesn't exist
        setTitle('Begin Your Future')
        setSubtitle('At Mandaluyong College of Science and Technology')
        setDescription('Unlock your potential with world-class programs tailored for new applicants and transferees. Join a thriving academic community that fosters innovation, leadership, and excellence.')
        setLogoImage('/mcst-logo.png')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      // Use mock data on error
      setTitle('Begin Your Future')
      setSubtitle('At Mandaluyong College of Science and Technology')
      setDescription('Unlock your potential with world-class programs tailored for new applicants and transferees. Join a thriving academic community that fosters innovation, leadership, and excellence.')
      setLogoImage('/mcst-logo.png')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!title.trim() || !subtitle.trim() || !description.trim()) {
      toast.error('All fields are required')
      return
    }

    setIsSaving(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/apply/hero/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subtitle,
          description,
          logo_image: logoImage,
        }),
      })

      if (response.ok) {
        toast.success('Hero section saved successfully!')
        setIsEditing(false)
        fetchData()
      } else {
        toast.error('Failed to save hero section')
      }
    } catch (error) {
      console.error('Error saving:', error)
      toast.error('An error occurred while saving')
    } finally {
      setIsSaving(false)
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
      setLogoImage(imageUrl)
      toast.success('Image uploaded successfully!')
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    fetchData()
  }

  if (isLoading) {
    return (
      <div className="p-6 w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Apply - Hero Section
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
        Apply - Hero Section
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {isEditing ? (
          <div className="p-6 space-y-6">
            {/* Edit Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Enter subtitle..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description..."
                  rows={4}
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
                    value={logoImage}
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
                    onSuccess={handleCloudinaryUpload}
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
                <ApplyHeroSection
                  title={title}
                  subtitle={subtitle}
                  description={description}
                  logoImage={logoImage}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
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
              Current Layout (From Database)
            </h2>
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
              <ApplyHeroSection
                title={title}
                subtitle={subtitle}
                description={description}
                logoImage={logoImage}
              />
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
