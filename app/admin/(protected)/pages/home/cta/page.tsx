'use client'

import { useState } from 'react'

interface CTASection {
  id: string
  title: string
  subtitle: string
  button_text: string
  button_link: string
  background_color: string
  text_color: string
  is_active: boolean
}

const STATIC_DATA: CTASection = {
  id: '1',
  title: 'Ready to Start Your Journey?',
  subtitle:
    'Join thousands of students who have transformed their careers through our programs.',
  button_text: 'Apply Now',
  button_link: '/admissions',
  background_color: '#003a7a',
  text_color: '#ffffff',
  is_active: true,
}

export default function CTASectionPage() {
  const [formData, setFormData] = useState<CTASection>(STATIC_DATA)

  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        CTA Section
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
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
          <textarea
            value={formData.subtitle}
            onChange={(e) => handleInputChange('subtitle', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Button Text */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Button Text
          </label>
          <input
            type="text"
            value={formData.button_text}
            onChange={(e) => handleInputChange('button_text', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Button Link */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Button Link
          </label>
          <input
            type="text"
            value={formData.button_link}
            onChange={(e) => handleInputChange('button_link', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Background Color
            </label>
            <input
              type="text"
              value={formData.background_color}
              onChange={(e) =>
                handleInputChange('background_color', e.target.value)
              }
              placeholder="e.g., #003a7a"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Text Color
            </label>
            <input
              type="text"
              value={formData.text_color}
              onChange={(e) => handleInputChange('text_color', e.target.value)}
              placeholder="e.g., #ffffff"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
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

        {/* Preview */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Preview
          </h2>
          <div
            className="w-full rounded-lg p-8 text-center"
            style={{
              backgroundColor: formData.background_color,
              color: formData.text_color,
            }}
          >
            <h3 className="text-3xl font-bold mb-2">{formData.title}</h3>
            <p className="text-lg mb-6">{formData.subtitle}</p>
            <button className="px-6 py-3 bg-white text-[#003a7a] font-semibold rounded-lg hover:bg-gray-100">
              {formData.button_text}
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Changes are saved locally. Database integration coming soon...
        </p>
      </div>
    </div>
  )
}
