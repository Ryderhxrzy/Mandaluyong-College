'use client'

import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import toast from 'react-hot-toast'
import CTA from '@/components/CTA'

interface CTASection {
  id?: string
  title: string
  description: string
  is_active: boolean
}

const DEFAULT_DATA: CTASection = {
  title: 'Ready to Shape Your Future?',
  description: 'Join a vibrant academic community where leadership, innovation, and excellence thrive. Whether you\'re just beginning or advancing your path, we\'re here to empower your journey.',
  is_active: true,
}

export default function CTASectionPage() {
  const [formData, setFormData] = useState<CTASection>(DEFAULT_DATA)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCTAData()
  }, [])

  const fetchCTAData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/home/cta`)
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setFormData({
            id: data.id?.toString(),
            title: data.title || DEFAULT_DATA.title,
            description: data.description || DEFAULT_DATA.description,
            is_active: data.is_active !== false
          })
        }
      }
    } catch (error) {
      console.error('Error fetching CTA data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Title is required')
      return
    }

    setIsSaving(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/home/cta/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('CTA section saved successfully!')
        setIsEditing(false)
        if (data.data) {
          setFormData({
            id: data.data.id?.toString(),
            title: data.data.title,
            description: data.data.description,
            is_active: data.data.is_active
          })
        }
      } else {
        toast.error(data.error || 'Failed to save CTA section')
      }
    } catch (error) {
      console.error('Error saving CTA section:', error)
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
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        CTA Section Settings
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {isEditing ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-100 dark:border-gray-700">
                Edit Content
              </h2>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Section Title
                </label>
                <textarea
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="w-5 h-5 rounded text-primary focus:ring-primary/20 accent-primary"
                />
                <label htmlFor="is_active" className="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                  Visible on Homepage
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-100 dark:border-gray-700">
                Live Preview
              </h2>
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                <CTA 
                  title={formData.title}
                  description={formData.description}
                  asPreview={true}
                />
              </div>
            </div>

            <div className="lg:col-span-2 flex gap-3 justify-end border-t border-gray-200 dark:border-gray-700 pt-6">
              <button
                onClick={() => setIsEditing(false)}
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
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Preview</h2>
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
              <CTA 
                title={formData.title}
                description={formData.description}
              />
            </div>
            {!formData.is_active && (
              <p className="text-amber-600 dark:text-amber-400 text-sm italic">
                * This section is currently hidden from the homepage.
              </p>
            )}
            <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsEditing(true)}
                className="px-8 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98]"
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
