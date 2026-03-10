'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from 'next-cloudinary'

interface HeroSection {
  id: string
  title: string
  subtitle: string
  description: string
  background_image_url: string
  is_active: boolean
}

const STATIC_DATA: HeroSection = {
  id: '1',
  title: 'Shaping Tomorrow\'s Innovators at',
  subtitle: 'Mandaluyong College of Science and Technology',
  description:
    'Discover a future built on innovation and excellence. Our programs in Information Systems, Mathematics, Communication, Public Administration, and Physical Education equip students with the skills and mindset to thrive in a technology-driven world.',
  background_image_url: 'https://picsum.photos/1600/900?random=1',
  is_active: true,
}

export default function HeroSectionPage() {
  const [formData, setFormData] = useState<HeroSection>(STATIC_DATA)
  const [isEditing, setIsEditing] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchHeroData()
  }, [])

  const fetchHeroData = async () => {
    try {
      const response = await fetch('/api/admin/home/hero/save')
      const data = await response.json()

      if (response.ok && data.data) {
        setFormData(data.data)
      } else {
        // Use static data as fallback
        setFormData(STATIC_DATA)
      }
    } catch (error) {
      console.error('Error fetching hero data:', error)
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
      const response = await fetch('/api/admin/home/hero/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Hero section saved successfully!')
        setIsEditing(false)
      } else {
        toast.error(data.error || 'Failed to save hero section')
      }
    } catch (error) {
      console.error('Error saving hero section:', error)
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
          Hero Section
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
        Hero Section
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
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
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
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Background Image Upload - Cloudinary */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Upload New Image to Cloudinary
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
                  className="relative w-full h-80 flex items-center overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-lg"
                  style={{
                    backgroundImage: formData.background_image_url
                      ? `url(${formData.background_image_url})`
                      : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  <div className="absolute inset-0 bg-black/70"></div>
                  <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 text-white">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold mb-3 leading-tight tracking-tight">
                      <span className="text-white block mb-1">{formData.title}</span>
                      <span style={{ color: '#50a2ff' }} className="block">
                        {formData.subtitle}
                      </span>
                    </h1>
                    <p className="text-xs sm:text-sm text-white leading-relaxed font-normal max-w-2xl mb-3">
                      {formData.description}
                    </p>
                    <div className="flex flex-row gap-2">
                      <button className="bg-primary text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md font-medium hover:bg-[#003a7a] transition flex items-center justify-center gap-1 text-xs sm:text-sm border border-primary whitespace-nowrap cursor-pointer">
                        Apply Now <ArrowRight size={14} />
                      </button>
                      <button className="border border-white text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md font-medium hover:bg-white/10 transition flex items-center justify-center text-xs sm:text-sm whitespace-nowrap cursor-pointer">
                        Explore Programs
                      </button>
                    </div>
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
                className="relative w-full h-96 flex items-center overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-lg"
                style={{
                  backgroundImage: formData.background_image_url
                    ? `url(${formData.background_image_url})`
                    : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                <div className="absolute inset-0 bg-black/70"></div>
                <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16 py-12 sm:py-16 text-white">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold mb-4 sm:mb-6 leading-tight tracking-tight">
                    <span className="text-white block mb-1 sm:mb-2">{formData.title}</span>
                    <span style={{ color: '#50a2ff' }} className="block">
                      {formData.subtitle}
                    </span>
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-10 text-white max-w-4xl leading-relaxed font-medium">
                    {formData.description}
                  </p>
                  <div className="flex flex-row gap-2 sm:gap-4">
                    <button className="bg-primary text-white px-4 sm:px-8 py-2 sm:py-3 rounded-md font-medium hover:bg-[#003a7a] transition flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base border border-primary whitespace-nowrap cursor-pointer">
                      Apply Now <ArrowRight size={16} />
                    </button>
                    <button className="border border-white text-white px-4 sm:px-8 py-2 sm:py-3 rounded-md font-medium hover:bg-white/10 transition flex items-center justify-center text-xs sm:text-sm md:text-base whitespace-nowrap cursor-pointer">
                      Explore Programs
                    </button>
                  </div>
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
