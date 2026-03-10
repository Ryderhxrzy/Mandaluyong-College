'use client'

import { useState, useEffect } from 'react'
import { Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from 'next-cloudinary'

interface CoreValuesSection {
  id: string
  title: string
  description: string
  background_image_url: string
  is_active: boolean
}

const STATIC_DATA: CoreValuesSection = {
  id: '1',
  title: 'Core Values That Drive Excellence at Mandaluyong College of Science and Technology',
  description:
    'At MCST, we are committed to genuine public service and fostering care within our community. Our core values of discipline, action over words, nationalism, and excellence guide us in shaping responsible and innovative leaders.',
  background_image_url: '/campus.png',
  is_active: true,
}

export default function CoreValuesSectionPage() {
  const [formData, setFormData] = useState<CoreValuesSection>(STATIC_DATA)
  const [isEditing, setIsEditing] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCoreValuesData()
  }, [])

  const fetchCoreValuesData = async () => {
    try {
      const response = await fetch('/api/admin/home/core-values')
      const data = await response.json()

      if (response.ok && data.data) {
        setFormData(data.data)
      } else {
        // Use static data as fallback
        setFormData(STATIC_DATA)
      }
    } catch (error) {
      console.error('Error fetching core values data:', error)
      // Use static data as fallback
      setFormData(STATIC_DATA)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData({
      ...formData,
      [field]: value,
    })
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
      setFormData(prev => ({
        ...prev,
        background_image_url: imageUrl,
      }))
      toast.success('Image uploaded successfully!')
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/home/core-values', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Core values section saved successfully!')
        setIsEditing(false)
        setFormData(data.data)
      } else {
        toast.error(data.error || 'Failed to save core values section')
      }
    } catch (error) {
      console.error('Error saving core values section:', error)
      toast.error('An error occurred while saving. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData(STATIC_DATA)
    setUploadedImage(null)
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <div className="p-6 w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Core Values Section
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
        Core Values Section
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {isEditing ? (
          <>
            {/* Grid Layout: Form (left) and Preview (right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Left: Form Inputs */}
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <textarea
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Background Image Upload - Cloudinary */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Upload New Background Image
                  </label>
                  <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                    onSuccess={handleCloudinaryUpload}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open()}
                        className="w-full px-4 py-3 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Upload size={18} />
                        {uploadedImage ? 'Change Image' : 'Click to upload image'}
                      </button>
                    )}
                  </CldUploadWidget>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {uploadedImage ? 'Image uploaded to Cloudinary' : 'Supported formats: JPG, PNG, GIF, WebP'}
                  </p>
                </div>

                {/* Background Image URL */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Or Paste Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.background_image_url}
                    onChange={(e) => handleInputChange('background_image_url', e.target.value)}
                    placeholder="e.g., https://example.com/image.jpg"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Paste an external image URL (will override uploaded image)
                  </p>
                </div>

                {/* Is Active */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <label
                    htmlFor="is_active"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Active
                  </label>
                </div>
              </div>

              {/* Right: Preview */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Preview
                </h2>
                <div
                  className="relative w-full py-20 flex items-center justify-center text-center overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700"
                  style={{
                    backgroundImage: `url(${formData.background_image_url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/65"></div>

                  {/* Content */}
                  <div className="relative z-10 w-full max-w-md mx-auto px-3 sm:px-4">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 leading-tight text-white" style={{ color: '#50a2ff' }}>
                      {formData.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-white leading-relaxed font-normal">
                      {formData.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end border-t border-gray-200 dark:border-gray-700 pt-6">
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
          </>
        ) : (
          <>
            {/* Preview */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Preview
              </h2>
              <div
                className="relative w-full py-24 md:py-32 flex items-center justify-center text-center overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700"
                style={{
                  backgroundImage: `url(${formData.background_image_url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/65"></div>

                {/* Content */}
                <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-8 md:px-16">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-8 leading-tight text-white" style={{ color: '#50a2ff' }}>
                    {formData.title}
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg text-white leading-relaxed font-normal max-w-3xl mx-auto">
                    {formData.description}
                  </p>
                </div>
              </div>
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
