'use client'

import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import AboutMissionVision from '@/components/about/AboutMissionVision'

export default function AboutMissionPage() {
  const [mission, setMission] = useState('')
  const [vision, setVision] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/about/mission-vision`)
      const data = await response.json()

      if (response.ok) {
        if (data.mission) setMission(data.mission)
        if (data.vision) setVision(data.vision)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!mission.trim() || !vision.trim()) {
      toast.error('Mission and vision are required')
      return
    }

    setIsSaving(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/about/mission-vision/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mission, vision }),
      })

      if (response.ok) {
        toast.success('Mission & Vision saved successfully!')
        setIsEditing(false)
      } else {
        toast.error('Failed to save mission & vision')
      }
    } catch (error) {
      console.error('Error saving:', error)
      toast.error('An error occurred while saving')
    } finally {
      setIsSaving(false)
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
          Mission & Vision
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
        Mission & Vision
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {isEditing ? (
          <div className="p-6 space-y-6">
            {/* Edit Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Mission
                </label>
                <textarea
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  placeholder="Enter mission statement..."
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Vision
                </label>
                <textarea
                  value={vision}
                  onChange={(e) => setVision(e.target.value)}
                  placeholder="Enter vision statement..."
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>

            {/* Live Preview */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Live Preview</h2>
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                <AboutMissionVision mission={mission} vision={vision} />
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
              <AboutMissionVision mission={mission} vision={vision} />
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
