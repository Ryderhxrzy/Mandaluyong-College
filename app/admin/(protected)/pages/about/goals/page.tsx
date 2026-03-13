'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from 'next-cloudinary'
import AboutGoalsPhilosophy, { GoalItem } from '@/components/about/AboutGoalsPhilosophy'

export default function AboutGoalsPage() {
  const [goalTitle, setGoalTitle] = useState('')
  const [goalItems, setGoalItems] = useState<GoalItem[]>([])
  const [philosophyTitle, setPhilosophyTitle] = useState('')
  const [philosophyDescription, setPhilosophyDescription] = useState('')
  const [philosophyImage, setPhilosophyImage] = useState('')
  const [philosophyImageAlt, setPhilosophyImageAlt] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingGoalHeader, setIsSavingGoalHeader] = useState(false)
  const [isSavingGoalItems, setIsSavingGoalItems] = useState(false)
  const [isSavingPhilosophy, setIsSavingPhilosophy] = useState(false)
  const [editingGoalItem, setEditingGoalItem] = useState<GoalItem | null>(null)
  const [isEditingPhilosophy, setIsEditingPhilosophy] = useState(false)
  const [uploadedPhilosophyImage, setUploadedPhilosophyImage] = useState<string | null>(null)

  // Helper functions for preview with merged editing state
  const getPreviewGoalItems = () => {
    if (!editingGoalItem) return goalItems
    const isNew = !goalItems.some(item => item.id === editingGoalItem.id)
    return isNew ? [...goalItems, editingGoalItem] : goalItems.map(item => item.id === editingGoalItem.id ? editingGoalItem : item)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

      // Fetch goals data
      const goalsResponse = await fetch(`${apiUrl}/api/admin/about/goals`)
      const goalsData = await goalsResponse.json()

      if (goalsResponse.ok) {
        if (goalsData.title) setGoalTitle(goalsData.title)
        if (goalsData.items?.length > 0) {
          const mappedItems = goalsData.items.map((item: any) => ({
            id: String(item.id),
            description: item.description,
          }))
          setGoalItems(mappedItems)
        }
      }

      // Fetch philosophy data
      const philosophyResponse = await fetch(`${apiUrl}/api/admin/about/philosophy`)
      const philosophyData = await philosophyResponse.json()

      if (philosophyResponse.ok) {
        if (philosophyData.title) setPhilosophyTitle(philosophyData.title)
        if (philosophyData.description) setPhilosophyDescription(philosophyData.description)
        if (philosophyData.image) setPhilosophyImage(philosophyData.image)
        if (philosophyData.image_alt) setPhilosophyImageAlt(philosophyData.image_alt)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveGoalHeader = async () => {
    if (!goalTitle.trim()) {
      toast.error('Goal title is required')
      return
    }

    setIsSavingGoalHeader(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/about/goals/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: goalTitle }),
      })

      if (response.ok) {
        toast.success('Goal header saved successfully!')
      } else {
        toast.error('Failed to save goal header')
      }
    } catch (error) {
      console.error('Error saving:', error)
      toast.error('An error occurred while saving')
    } finally {
      setIsSavingGoalHeader(false)
    }
  }

  const handleAddGoalItem = () => {
    setEditingGoalItem({
      id: String(Date.now()),
      description: '',
    })
  }

  const handleEditGoalItem = (item: GoalItem) => {
    setEditingGoalItem(item)
  }

  const handleSaveGoalItem = async () => {
    if (!editingGoalItem?.description.trim()) {
      toast.error('Description is required')
      return
    }

    setIsSavingGoalItems(true)
    try {
      const isNew = !goalItems.some(item => item.id === editingGoalItem.id)
      const updatedItems = isNew ? [...goalItems, editingGoalItem] : goalItems.map(item => item.id === editingGoalItem.id ? editingGoalItem : item)

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/about/goals/items/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updatedItems }),
      })

      if (response.ok) {
        setGoalItems(updatedItems)
        toast.success('Goal item saved successfully!')
        setEditingGoalItem(null)
      } else {
        toast.error('Failed to save goal item')
      }
    } catch (error) {
      console.error('Error saving goal item:', error)
      toast.error('An error occurred while saving')
    } finally {
      setIsSavingGoalItems(false)
    }
  }

  const handleDeleteGoalItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this goal item?')) return
    try {
      const updatedItems = goalItems.filter(item => item.id !== id)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/about/goals/items/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updatedItems }),
      })

      if (response.ok) {
        setGoalItems(updatedItems)
        toast.success('Goal item deleted!')
      } else {
        toast.error('Failed to delete goal item')
      }
    } catch (error) {
      console.error('Error deleting goal item:', error)
      toast.error('An error occurred while deleting')
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
      setUploadedPhilosophyImage(imageUrl)
      setPhilosophyImage(imageUrl)
      toast.success('Image uploaded successfully!')
    }
  }

  const handleSavePhilosophy = async () => {
    if (!philosophyTitle.trim() || !philosophyDescription.trim() || !philosophyImage.trim()) {
      toast.error('Title, description, and image are required')
      return
    }

    setIsSavingPhilosophy(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/about/philosophy/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: philosophyTitle,
          description: philosophyDescription,
          image: philosophyImage,
          image_alt: philosophyImageAlt,
        }),
      })

      if (response.ok) {
        toast.success('Philosophy saved successfully!')
        setIsEditingPhilosophy(false)
        setUploadedPhilosophyImage(null)
      } else {
        toast.error('Failed to save philosophy')
      }
    } catch (error) {
      console.error('Error saving philosophy:', error)
      toast.error('An error occurred while saving')
    } finally {
      setIsSavingPhilosophy(false)
    }
  }

  const handleCancelPhilosophyEdit = () => {
    setUploadedPhilosophyImage(null)
    setIsEditingPhilosophy(false)
    fetchData()
  }

  if (isLoading) {
    return (
      <div className="p-6 w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Goals & Philosophy
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // When editing a goal item
  if (editingGoalItem) {
    return (
      <div className="p-6 w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Goals & Philosophy
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Goal Description
                </label>
                <textarea
                  value={editingGoalItem.description}
                  onChange={(e) => setEditingGoalItem({ ...editingGoalItem, description: e.target.value })}
                  placeholder="e.g., Provide quality education..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setEditingGoalItem(null)}
                  className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveGoalItem}
                  disabled={isSavingGoalItems}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSavingGoalItems ? 'Saving...' : 'Save Goal Item'}
                </button>
              </div>
            </div>

            {/* Live Preview */}
            <div className="space-y-4">
              <div className="flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10 py-2 border-b border-gray-100 dark:border-gray-700 mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Live Preview</h2>
                <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Real-time View</span>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900 sticky top-14 max-h-[calc(100vh-250px)] overflow-y-auto shadow-sm">
                <AboutGoalsPhilosophy
                  goalTitle={goalTitle}
                  goalItems={getPreviewGoalItems()}
                  philosophyTitle={philosophyTitle}
                  philosophyDescription={philosophyDescription}
                  philosophyImage={philosophyImage}
                  philosophyImageAlt={philosophyImageAlt}
                  previewMode={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // When editing philosophy
  if (isEditingPhilosophy) {
    return (
      <div className="p-6 w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Goals & Philosophy
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Philosophy Title
                </label>
                <input
                  type="text"
                  value={philosophyTitle}
                  onChange={(e) => setPhilosophyTitle(e.target.value)}
                  placeholder="e.g., Philosophy"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Philosophy Description
                </label>
                <textarea
                  value={philosophyDescription}
                  onChange={(e) => setPhilosophyDescription(e.target.value)}
                  placeholder="e.g., Our philosophy is..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              {/* Cloudinary Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  Upload Image
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
                        <p className="font-medium">{uploadedPhilosophyImage ? 'Change Image' : 'Click to upload image'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Supported formats: JPG, PNG, GIF, WebP
                        </p>
                      </div>
                    </button>
                  )}
                </CldUploadWidget>
              </div>

              {/* Or paste URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Or Paste Image URL
                </label>
                <input
                  type="text"
                  value={philosophyImage}
                  onChange={(e) => setPhilosophyImage(e.target.value)}
                  placeholder="e.g., https://..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={philosophyImageAlt}
                  onChange={(e) => setPhilosophyImageAlt(e.target.value)}
                  placeholder="e.g., MCST Goals"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleCancelPhilosophyEdit}
                  className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePhilosophy}
                  disabled={isSavingPhilosophy}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSavingPhilosophy ? 'Saving...' : 'Save Philosophy'}
                </button>
              </div>
            </div>

            {/* Live Preview */}
            <div className="space-y-4">
              <div className="flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10 py-2 border-b border-gray-100 dark:border-gray-700 mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Live Preview</h2>
                <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Real-time View</span>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900 sticky top-14 max-h-[calc(100vh-250px)] overflow-y-auto shadow-sm">
                <AboutGoalsPhilosophy
                  goalTitle={goalTitle}
                  goalItems={goalItems}
                  philosophyTitle={philosophyTitle}
                  philosophyDescription={philosophyDescription}
                  philosophyImage={philosophyImage}
                  philosophyImageAlt={philosophyImageAlt}
                  previewMode={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default view
  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Goals & Philosophy
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-8">
        {/* Goals Header Section */}
        <div className="pb-6 border-b border-gray-200 dark:border-gray-700 space-y-4">
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Goals Section Title
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                placeholder="Section Title"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-primary/20 outline-none"
              />
              <button
                onClick={handleSaveGoalHeader}
                disabled={isSavingGoalHeader}
                className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSavingGoalHeader ? 'Saving...' : 'Update'}
              </button>
            </div>
          </div>
        </div>

        {/* Current Layout Preview */}
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Current Layout (From Database)</h2>
            <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
            <AboutGoalsPhilosophy
              goalTitle={goalTitle || 'Goals'}
              goalItems={goalItems.length > 0 ? goalItems : []}
              philosophyTitle={philosophyTitle || 'Philosophy'}
              philosophyDescription={philosophyDescription || ''}
              philosophyImage={philosophyImage || '/goals.jpg'}
              philosophyImageAlt={philosophyImageAlt || 'MCST Goals'}
            />
          </div>
        </div>

        {/* Manage Goal Items */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Goal Items</h2>
            <button
              onClick={handleAddGoalItem}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-[#003a7a] transition cursor-pointer flex items-center gap-2"
            >
              <Plus size={16} /> Add Item
            </button>
          </div>
          <div className="space-y-3">
            {goalItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl">
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-2xl">{item.description}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEditGoalItem(item)}
                    className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 cursor-pointer flex items-center gap-1"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteGoalItem(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            {goalItems.length === 0 && (
              <p className="text-center py-10 text-gray-500 italic">No goal items found. Create your first item!</p>
            )}
          </div>
        </div>

        {/* Philosophy Section */}
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Philosophy Section</h2>
            <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
          </div>
          {isEditingPhilosophy ? null : (
            <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-4 space-y-3">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Title</p>
                <p className="text-gray-900 dark:text-white font-medium">{philosophyTitle || 'Not set'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Description</p>
                <p className="text-gray-700 dark:text-gray-300 text-sm truncate max-w-2xl">{philosophyDescription || 'Not set'}</p>
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => setIsEditingPhilosophy(true)}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition cursor-pointer flex items-center gap-2"
                >
                  <Edit2 size={16} /> Edit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
