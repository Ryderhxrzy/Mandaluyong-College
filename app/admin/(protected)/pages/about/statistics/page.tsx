'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from 'next-cloudinary'
import AboutKeyStatistics, { StatItem, StatImage } from '@/components/about/AboutKeyStatistics'

export default function AboutStatisticsPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [items, setItems] = useState<StatItem[]>([])
  const [images, setImages] = useState<StatImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingHeader, setIsSavingHeader] = useState(false)
  const [isSavingCard, setIsSavingCard] = useState(false)
  const [isSavingImage, setIsSavingImage] = useState(false)
  const [editingCard, setEditingCard] = useState<StatItem | null>(null)
  const [editingImage, setEditingImage] = useState<StatImage | null>(null)

  // Helper functions for preview with merged editing state
  const getPreviewItems = () => {
    if (!editingCard) return items
    const isNew = !items.some(item => item.id === editingCard.id)
    return isNew ? [...items, editingCard] : items.map(item => item.id === editingCard.id ? editingCard : item)
  }

  const getPreviewImages = () => {
    if (!editingImage) return images
    const isNew = !images.some(img => img.id === editingImage.id)
    return isNew ? [...images, editingImage] : images.map(img => img.id === editingImage.id ? editingImage : img)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/about/key-statistics`)
      const data = await response.json()

      if (response.ok) {
        if (data.title) setTitle(data.title)
        if (data.description) setDescription(data.description)
        if (data.items?.length > 0) {
          const mappedItems = data.items.map((item: any) => ({
            id: String(item.id),
            value: item.value,
            label: item.label,
          }))
          setItems(mappedItems)
        }
        if (data.images?.length > 0) {
          const mappedImages = data.images.map((img: any) => ({
            id: String(img.id),
            image: img.image,
            altText: img.alt_text,
          }))
          setImages(mappedImages)
        }
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

    setIsSavingHeader(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/about/key-statistics/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      })

      if (response.ok) {
        toast.success('Header saved successfully!')
      } else {
        toast.error('Failed to save header')
      }
    } catch (error) {
      console.error('Error saving:', error)
      toast.error('An error occurred while saving')
    } finally {
      setIsSavingHeader(false)
    }
  }

  const handleAddCard = () => {
    setEditingCard({
      id: String(Date.now()),
      value: '',
      label: '',
    })
  }

  const handleEditCard = (card: StatItem) => {
    setEditingCard(card)
  }

  const handleSaveCard = async () => {
    if (!editingCard?.value.trim() || !editingCard?.label.trim()) {
      toast.error('Value and Label are required')
      return
    }

    setIsSavingCard(true)
    try {
      const isNew = !items.some(item => item.id === editingCard.id)
      const updatedItems = isNew ? [...items, editingCard] : items.map(item => item.id === editingCard.id ? editingCard : item)

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/about/key-statistics/content/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updatedItems, images }),
      })

      if (response.ok) {
        setItems(updatedItems)
        toast.success('Card saved successfully!')
        setEditingCard(null)
      } else {
        toast.error('Failed to save card to database')
      }
    } catch (error) {
      console.error('Error saving card:', error)
      toast.error('An error occurred while saving')
    } finally {
      setIsSavingCard(false)
    }
  }

  const handleDeleteCard = async (id: string) => {
    if (!confirm('Are you sure you want to delete this card?')) return
    try {
      const updatedItems = items.filter(item => item.id !== id)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/about/key-statistics/content/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updatedItems, images }),
      })

      if (response.ok) {
        setItems(updatedItems)
        toast.success('Card deleted!')
      } else {
        toast.error('Failed to delete card')
      }
    } catch (error) {
      console.error('Error deleting card:', error)
      toast.error('An error occurred while deleting')
    }
  }

  const handleAddImage = () => {
    setEditingImage({
      id: String(Date.now()),
      image: '',
      altText: '',
    })
  }

  const handleEditImage = (image: StatImage) => {
    setEditingImage(image)
  }

  const handleCloudinaryUpload = (results: CloudinaryUploadWidgetResults) => {
    if (
      results.event === 'success' &&
      results.info &&
      typeof results.info === 'object' &&
      'secure_url' in results.info
    ) {
      const imageUrl = (results.info as { secure_url: string }).secure_url
      if (editingImage) {
        setEditingImage({ ...editingImage, image: imageUrl })
      }
      toast.success('Image uploaded successfully!')
    }
  }

  const handleSaveImage = async () => {
    if (!editingImage?.image.trim() || !editingImage?.altText.trim()) {
      toast.error('Image URL and Alt Text are required')
      return
    }

    setIsSavingImage(true)
    try {
      const isNew = !images.some(img => img.id === editingImage.id)
      const updatedImages = isNew ? [...images, editingImage] : images.map(img => img.id === editingImage.id ? editingImage : img)

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/about/key-statistics/content/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, images: updatedImages }),
      })

      if (response.ok) {
        setImages(updatedImages)
        toast.success('Image saved successfully!')
        setEditingImage(null)
      } else {
        toast.error('Failed to save image to database')
      }
    } catch (error) {
      console.error('Error saving image:', error)
      toast.error('An error occurred while saving')
    } finally {
      setIsSavingImage(false)
    }
  }

  const handleDeleteImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return
    try {
      const updatedImages = images.filter(img => img.id !== id)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/about/key-statistics/content/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, images: updatedImages }),
      })

      if (response.ok) {
        setImages(updatedImages)
        toast.success('Image deleted!')
      } else {
        toast.error('Failed to delete image')
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      toast.error('An error occurred while deleting')
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Key Statistics
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // When editing a card
  if (editingCard) {
    return (
      <div className="p-6 w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Key Statistics
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Card Value
                </label>
                <input
                  type="text"
                  value={editingCard.value}
                  onChange={(e) => setEditingCard({ ...editingCard, value: e.target.value })}
                  placeholder="e.g., 420+"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Card Label
                </label>
                <textarea
                  value={editingCard.label}
                  onChange={(e) => setEditingCard({ ...editingCard, label: e.target.value })}
                  placeholder="e.g., Students enrolled in diverse academic programs."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setEditingCard(null)}
                  className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCard}
                  disabled={isSavingCard}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSavingCard ? 'Saving...' : 'Save Card'}
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
                <AboutKeyStatistics title={title} description={description} items={getPreviewItems()} images={getPreviewImages()} previewMode={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // When editing an image
  if (editingImage) {
    return (
      <div className="p-6 w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Key Statistics
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Form */}
            <div className="space-y-6">
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
                        <p className="font-medium">{editingImage.image ? 'Change Image' : 'Click to upload image'}</p>
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
                  value={editingImage.image}
                  onChange={(e) => setEditingImage({ ...editingImage, image: e.target.value })}
                  placeholder="e.g., https://..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Alt Text
                </label>
                <textarea
                  value={editingImage.altText}
                  onChange={(e) => setEditingImage({ ...editingImage, altText: e.target.value })}
                  placeholder="e.g., MCST Campus Life"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setEditingImage(null)}
                  className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveImage}
                  disabled={isSavingImage}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSavingImage ? 'Saving...' : 'Save Image'}
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
                <AboutKeyStatistics title={title} description={description} items={getPreviewItems()} images={getPreviewImages()} previewMode={true} />
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
        Key Statistics
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-8">
        {/* Header Section */}
        <div className="pb-6 border-b border-gray-200 dark:border-gray-700 space-y-4">
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Section Header (Title & Description)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Section Title"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-primary/20 outline-none"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Section Description"
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
            />
            <button
              onClick={handleSaveHeader}
              disabled={isSavingHeader}
              className="self-end px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSavingHeader ? 'Saving...' : 'Update'}
            </button>
          </div>
        </div>

        {/* Current Layout Preview */}
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Current Layout (From Database)</h2>
            <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
            <AboutKeyStatistics
              title={title || 'No title added'}
              description={description || 'No description added'}
              items={items.length > 0 ? items : []}
              images={images.length > 0 ? images : []}
            />
          </div>
        </div>

        {/* Manage Cards */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Statistics Cards</h2>
            <button
              onClick={handleAddCard}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-[#003a7a] transition cursor-pointer flex items-center gap-2"
            >
              <Plus size={16} /> Add Card
            </button>
          </div>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl">
                <div className="flex-1">
                  <p className="font-bold text-gray-900 dark:text-white">{item.value}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-md">{item.label}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditCard(item)}
                    className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 cursor-pointer flex items-center gap-1"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCard(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <p className="text-center py-10 text-gray-500 italic">No cards found. Create your first card!</p>
            )}
          </div>
        </div>

        {/* Manage Images */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Images</h2>
            <button
              onClick={handleAddImage}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-[#003a7a] transition cursor-pointer flex items-center gap-2"
            >
              <Plus size={16} /> Add Image
            </button>
          </div>
          <div className="space-y-3">
            {images.map((img) => (
              <div key={img.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl">
                <div className="flex items-center gap-4 flex-1">
                  <img
                    src={img.image}
                    alt={img.altText}
                    className="w-16 h-16 object-cover rounded-lg bg-gray-200 dark:bg-gray-600"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 dark:text-white text-sm">{img.altText}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{img.image}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditImage(img)}
                    className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 cursor-pointer flex items-center gap-1"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteImage(img.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            {images.length === 0 && (
              <p className="text-center py-10 text-gray-500 italic">No images found. Upload your first image!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
