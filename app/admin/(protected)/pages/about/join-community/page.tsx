'use client'

import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { Trash2, Upload } from 'lucide-react'
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from 'next-cloudinary'
import AboutJoinCommunity, { JoinCommunityImage } from '@/components/about/AboutJoinCommunity'

export default function AboutJoinCommunityPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<JoinCommunityImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditingHeader, setIsEditingHeader] = useState(false)
  const [editingImage, setEditingImage] = useState<JoinCommunityImage | null>(null)
  const [editingImageUrl, setEditingImageUrl] = useState('')
  const [editingImageAlt, setEditingImageAlt] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/about/join-community`)
      const data = await response.json()

      if (response.ok) {
        if (data.title) setTitle(data.title)
        if (data.description) setDescription(data.description)
        if (data.images) {
          const mappedImages: JoinCommunityImage[] = data.images.map((img: any) => ({
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

    setIsSaving(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/about/join-community/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
        }),
      })

      if (response.ok) {
        toast.success('Join Community section updated!')
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

  const handleSaveImages = async (imagesToSave: JoinCommunityImage[]) => {
    setIsSaving(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/about/join-community/images/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: imagesToSave.map(({ id, ...rest }) => rest),
        }),
      })

      if (response.ok) {
        toast.success('Images saved!')
        setEditingImage(null)
      } else {
        toast.error('Failed to save images')
      }
    } catch (error) {
      console.error('Error saving images:', error)
      toast.error('An error occurred while saving')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddImage = () => {
    const newImage: JoinCommunityImage = {
      id: Date.now().toString(),
      image: '',
      altText: '',
    }
    setImages([...images, newImage])
    setEditingImage(newImage)
    setEditingImageUrl('')
    setEditingImageAlt('')
  }

  const handleEditImage = (image: JoinCommunityImage) => {
    setEditingImage(image)
    setEditingImageUrl(image.image)
    setEditingImageAlt(image.altText)
  }

  const handleSaveImage = async () => {
    if (!editingImageUrl.trim() || !editingImageAlt.trim()) {
      toast.error('Image URL and alt text are required')
      return
    }

    if (editingImage) {
      const updatedImages = images.map((image) =>
        image.id === editingImage.id
          ? { ...image, image: editingImageUrl, altText: editingImageAlt }
          : image
      )
      setImages(updatedImages)
      await handleSaveImages(updatedImages)
    }
  }

  const handleDeleteImage = async (id: string) => {
    const updatedImages = images.filter((image) => image.id !== id)
    setImages(updatedImages)
    await handleSaveImages(updatedImages)
  }

  const handleCancelEditImage = () => {
    setEditingImage(null)
    setEditingImageUrl('')
    setEditingImageAlt('')
  }

  const handleCloudinaryUpload = (results: CloudinaryUploadWidgetResults) => {
    if (
      results.event === 'success' &&
      results.info &&
      typeof results.info === 'object' &&
      'secure_url' in results.info
    ) {
      const imageUrl = (results.info as { secure_url: string }).secure_url
      setEditingImageUrl(imageUrl)
      toast.success('Image uploaded successfully!')
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Join MCST Community
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Edit Image View
  if (editingImage) {
    return (
      <div className="p-6 w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Join MCST Community
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Edit Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {editingImage.id === Date.now().toString() ? 'Add' : 'Edit'} Image
            </h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Image
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
                      <p className="font-medium">{editingImageUrl ? 'Change Image' : 'Click to upload image'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Supported formats: JPG, PNG, GIF, WebP
                      </p>
                    </div>
                  </button>
                )}
              </CldUploadWidget>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Alt Text
              </label>
              <input
                type="text"
                value={editingImageAlt}
                onChange={(e) => setEditingImageAlt(e.target.value)}
                placeholder="Enter image description..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleCancelEditImage}
                className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveImage}
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
              <AboutJoinCommunity
                title={title}
                description={description}
                images={images.map((image) =>
                  image.id === editingImage?.id
                    ? { ...image, image: editingImageUrl, altText: editingImageAlt }
                    : image
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
          Join MCST Community
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
              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Use \n for line breaks</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description..."
                rows={6}
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
              <AboutJoinCommunity
                title={title}
                description={description}
                images={images}
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
        Join MCST Community
      </h1>

      <div className="space-y-6">
        {/* Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Current Layout (From Database)
          </h2>
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
            <AboutJoinCommunity
              title={title}
              description={description}
              images={images}
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

        {/* Images List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Images
            </h2>
            <button
              onClick={handleAddImage}
              className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition cursor-pointer"
            >
              Add Image
            </button>
          </div>

          {images.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No images yet. Add one to get started!</p>
          ) : (
            <div className="space-y-3">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex justify-between items-start"
                >
                  <div className="flex gap-4 flex-1">
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                      <Image src={image.image} alt={image.altText} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                        Alt: {image.altText}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditImage(image)}
                      className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteImage(image.id)}
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
