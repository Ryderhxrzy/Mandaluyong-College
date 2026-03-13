'use client'

import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import AboutCoreValuesSection, { CoreValueItem } from '@/components/about/AboutCoreValuesSection'

export default function AboutCoreValuesPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [campusTitle, setCampusTitle] = useState('')
  const [campusDescription, setCampusDescription] = useState('')
  const [items, setItems] = useState<CoreValueItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditingHeader, setIsEditingHeader] = useState(false)
  const [editingItem, setEditingItem] = useState<CoreValueItem | null>(null)
  const [editingItemName, setEditingItemName] = useState('')
  const [editingItemDescription, setEditingItemDescription] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/about/core-values`)
      const data = await response.json()

      if (response.ok) {
        if (data.title) setTitle(data.title)
        if (data.description) setDescription(data.description)
        if (data.image) setImage(data.image)
        if (data.campus_title) setCampusTitle(data.campus_title)
        if (data.campus_description) setCampusDescription(data.campus_description)
        if (data.items) setItems(data.items)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveHeader = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error('Title and description are required')
      return
    }

    setIsSaving(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/about/core-values/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          image,
          campus_title: campusTitle,
          campus_description: campusDescription,
        }),
      })

      if (response.ok) {
        toast.success('Core Values section updated!')
        setIsEditingHeader(false)
      } else {
        toast.error('Failed to save section')
      }
    } catch (error) {
      console.error('Error saving:', error)
      toast.error('An error occurred while saving')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveItems = async (itemsToSave: CoreValueItem[]) => {
    setIsSaving(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/about/core-values/items/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: itemsToSave.map(({ id, ...rest }) => rest),
        }),
      })

      if (response.ok) {
        toast.success('Core Values items saved!')
        setEditingItem(null)
      } else {
        toast.error('Failed to save items')
      }
    } catch (error) {
      console.error('Error saving items:', error)
      toast.error('An error occurred while saving')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddItem = () => {
    const newItem: CoreValueItem = {
      id: Date.now().toString(),
      name: '',
      description: '',
    }
    setItems([...items, newItem])
    setEditingItem(newItem)
    setEditingItemName('')
    setEditingItemDescription('')
  }

  const handleEditItem = (item: CoreValueItem) => {
    setEditingItem(item)
    setEditingItemName(item.name)
    setEditingItemDescription(item.description)
  }

  const handleSaveItem = async () => {
    if (!editingItemName.trim() || !editingItemDescription.trim()) {
      toast.error('Name and description are required')
      return
    }

    if (editingItem) {
      const updatedItems = items.map((item) =>
        item.id === editingItem.id
          ? { ...item, name: editingItemName, description: editingItemDescription }
          : item
      )
      setItems(updatedItems)
      await handleSaveItems(updatedItems)
    }
  }

  const handleDeleteItem = async (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id)
    setItems(updatedItems)
    await handleSaveItems(updatedItems)
  }

  const handleCancelEditItem = () => {
    setEditingItem(null)
    setEditingItemName('')
    setEditingItemDescription('')
  }

  const handleImageUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || '')

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      const data = await response.json()
      if (data.secure_url) {
        setImage(data.secure_url)
        toast.success('Image uploaded successfully')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Core Values
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Edit Item View
  if (editingItem) {
    return (
      <div className="p-6 w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Core Values
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Edit Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {editingItem.id === Date.now().toString() ? 'Add' : 'Edit'} Core Value
            </h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                value={editingItemName}
                onChange={(e) => setEditingItemName(e.target.value)}
                placeholder="Enter core value name..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={editingItemDescription}
                onChange={(e) => setEditingItemDescription(e.target.value)}
                placeholder="Enter core value description..."
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleCancelEditItem}
                className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveItem}
                disabled={isSaving}
                className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>

          {/* Live Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Preview
            </h2>
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
              <AboutCoreValuesSection
                title={title}
                description={description}
                image={image}
                campusTitle={campusTitle}
                campusDescription={campusDescription}
                items={items.map((item) =>
                  item.id === editingItem?.id
                    ? { ...item, name: editingItemName, description: editingItemDescription }
                    : item
                )}
                previewMode={true}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Edit Header View
  if (isEditingHeader) {
    return (
      <div className="p-6 w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Core Values
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Edit Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Edit Section
            </h2>

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

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload(file)
                }}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              {image && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Image uploaded: {image.split('/').pop()}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Campus Title
              </label>
              <input
                type="text"
                value={campusTitle}
                onChange={(e) => setCampusTitle(e.target.value)}
                placeholder="Enter campus title..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Campus Description
              </label>
              <textarea
                value={campusDescription}
                onChange={(e) => setCampusDescription(e.target.value)}
                placeholder="Enter campus description..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsEditingHeader(false)}
                className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveHeader}
                disabled={isSaving}
                className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>

          {/* Live Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Preview
            </h2>
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
              <AboutCoreValuesSection
                title={title}
                description={description}
                image={image}
                campusTitle={campusTitle}
                campusDescription={campusDescription}
                items={items}
                previewMode={true}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default List View
  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Core Values
      </h1>

      <div className="space-y-6">
        {/* Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Current Layout (From Database)
          </h2>
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
            <AboutCoreValuesSection
              title={title}
              description={description}
              image={image}
              campusTitle={campusTitle}
              campusDescription={campusDescription}
              items={items}
            />
          </div>

          {/* Header Edit Button */}
          <div className="flex gap-3 justify-end border-t border-gray-200 dark:border-gray-700 pt-4">
            <button
              onClick={() => setIsEditingHeader(true)}
              className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition cursor-pointer"
            >
              Edit Section
            </button>
          </div>
        </div>

        {/* Core Values Items */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Core Values Items
            </h2>
            <button
              onClick={handleAddItem}
              className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition cursor-pointer"
            >
              Add Item
            </button>
          </div>

          {items.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No items yet. Add one to get started!</p>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex justify-between items-start"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
