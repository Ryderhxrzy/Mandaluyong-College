'use client'

import AboutWhyChoose from '@/components/AboutWhyChoose'

export default function AboutWhyChoosePage() {
  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Why Choose MCST
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {/* Preview Section */}
        <div className="space-y-6 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Preview
          </h2>
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
            <AboutWhyChoose />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end border-t border-gray-200 dark:border-gray-700 p-6 pt-6">
          <button className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition cursor-pointer">
            Edit
          </button>
        </div>
      </div>
    </div>
  )
}
