'use client'

import { useState, useEffect } from 'react'
import { Save, Plus, Trash2, Edit2, X, Image as ImageIcon, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import AdmissionsCTA from '@/components/academics/admissions/AdmissionsCTA'
import Link from 'next/link'
import { CldUploadWidget } from 'next-cloudinary'

interface CTAData {
  id: number
  title: string
  description: string
  images: CTAImage[]
}

interface CTAImage {
  id: string
  image_url: string
  alt_text: string
  order_index: number
}

const DEFAULT_DATA: CTAData = {
  id: 0,
  title: 'MCST Mandaluyong College of Science and Technology',
  description: 'Begin your journey with an institution dedicated to excellence in science, innovation, and inclusive education.',
  images: []
}

export default function AdmissionsCTAAdmin() {
  const [data, setData] = useState<CTAData>(DEFAULT_DATA)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditingContent, setIsEditingContent] = useState(false)
  
  // Image Editing State
  const [editingImageId, setEditingImageId] = useState<string | null>(null)
  const [imageFormData, setImageFormData] = useState({ image_url: '', alt_text: '' })
  const [showImageForm, setShowImageForm] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/admissions/cta')
      if (response.ok) {
        const result = await response.json()
        if (result) {
          setData(result)
        }
      }
    } catch (error) {
      console.error('Error fetching CTA data:', error)
      toast.error('Failed to load CTA data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateContent = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/admissions/cta', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: data.id,
          title: data.title,
          description: data.description
        }),
      })

      if (response.ok) {
        toast.success('Content updated successfully')
        setIsEditingContent(false)
        fetchData()
      } else {
        toast.error('Failed to update content')
      }
    } catch (error) {
      console.error('Error updating content:', error)
      toast.error('An error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddImage = async () => {
    if (!imageFormData.image_url) {
      toast.error('Image URL is required')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/admissions/cta/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(imageFormData),
      })

      if (response.ok) {
        toast.success('Image added successfully')
        setImageFormData({ image_url: '', alt_text: '' })
        setShowImageForm(false)
        fetchData()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to add image')
      }
    } catch (error) {
      console.error('Error adding image:', error)
      toast.error('An error occurred while adding the image')
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateImage = async () => {
    if (!editingImageId) return
    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/admissions/cta/images/${editingImageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(imageFormData),
      })

      if (response.ok) {
        toast.success('Image updated successfully')
        setEditingImageId(null)
        setImageFormData({ image_url: '', alt_text: '' })
        setShowImageForm(false)
        fetchData()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to update image')
      }
    } catch (error) {
      console.error('Error updating image:', error)
      toast.error('An error occurred while updating the image')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return
    try {
      const response = await fetch(`/api/admin/admissions/cta/images/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        toast.success('Image deleted successfully')
        fetchData()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to delete image')
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      toast.error('An error occurred while deleting the image')
    }
  }

  const openEditImage = (image: CTAImage) => {
    setEditingImageId(image.id)
    setImageFormData({ image_url: image.image_url, alt_text: image.alt_text })
    setShowImageForm(true)
  }

  if (isLoading) return <div className="p-8">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <Link href="/admin/pages/academics/admissions" className="flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft size={16} /> Back to Admissions
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admissions CTA Section</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage the call-to-action content and images</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content Form */}
          <div className="xl:col-span-2 space-y-8">
            {/* Content Settings Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Content Settings</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage the title and description for the CTA section</p>
                </div>
                {!isEditingContent ? (
                  <button 
                    onClick={() => setIsEditingContent(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition cursor-pointer"
                  >
                    <Edit2 size={16} /> Edit Content
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIsEditingContent(false)}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleUpdateContent}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition cursor-pointer disabled:opacity-50"
                    >
                      <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                  {isEditingContent ? (
                    <input 
                      type="text" 
                      value={data.title}
                      onChange={(e) => setData({ ...data, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent"
                    />
                  ) : (
                    <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{data.title}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  {isEditingContent ? (
                    <textarea 
                      rows={4}
                      value={data.description}
                      onChange={(e) => setData({ ...data, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent"
                    />
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{data.description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Image Gallery Management Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Image Gallery Management</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Add, edit, or remove images from the CTA gallery</p>
                </div>
                <button 
                  onClick={() => {
                    setEditingImageId(null);
                    setImageFormData({ image_url: '', alt_text: '' });
                    setShowImageForm(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition cursor-pointer"
                >
                  <Plus size={16} /> Add New Image
                </button>
              </div>

              {/* Image Stats */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{data.images.length}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Total Images</div>
                    </div>
                    <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{data.images.filter(img => img.image_url).length}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">With URLs</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Recommended: 4 images (2x2 grid)
                  </div>
                </div>
              </div>

              {/* Images Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {data.images.map((img) => (
                  <div key={img.id} className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
                    <img src={img.image_url} alt={img.alt_text} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                      <button onClick={() => openEditImage(img)} className="p-2 bg-white text-gray-900 rounded-full hover:bg-gray-100 cursor-pointer" title="Edit Image">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDeleteImage(img.id)} className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 cursor-pointer" title="Delete Image">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition">
                      <p className="text-xs text-white truncate">{img.alt_text}</p>
                    </div>
                  </div>
                ))}
                {data.images.length === 0 && (
                  <div className="col-span-full text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-2">No images added yet</p>
                    <p className="text-sm text-gray-500">Click "Add New Image" to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="xl:col-span-1">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold mb-4 text-center">Preview Snapshot</h2>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 overflow-hidden transform scale-[0.85] origin-top">
                  <div className="p-4 bg-white dark:bg-gray-800 flex flex-col items-center text-center">
                    <h3 className="text-lg font-bold mb-2">{data.title}</h3>
                    <p className="text-xs text-gray-500 mb-4 line-clamp-3">{data.description}</p>
                    <div className="grid grid-cols-2 gap-1 w-full max-w-[200px]">
                      {data.images.slice(0, 4).map((img, i) => (
                        <div key={i} className="aspect-square bg-gray-200 rounded overflow-hidden">
                          <img src={img.image_url} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center mt-2 italic">Actual layout varies by screen size</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal for Image Add/Edit */}
        {showImageForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">{editingImageId ? 'Edit Image' : 'Add New Image'}</h3>
                <button onClick={() => setShowImageForm(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Image URL</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Cloudinary URL or public path"
                      value={imageFormData.image_url}
                      onChange={(e) => setImageFormData({ ...imageFormData, image_url: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent"
                    />
                    <CldUploadWidget 
                      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                      onSuccess={(result: any) => {
                        if (result.event === 'success') {
                          setImageFormData({ ...imageFormData, image_url: result.info.secure_url });
                          toast.success('Upload success!');
                        }
                      }}
                    >
                      {({ open }) => (
                        <button 
                          onClick={() => open()}
                          className="p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                        >
                          <ImageIcon size={20} />
                        </button>
                      )}
                    </CldUploadWidget>
                  </div>
                  {imageFormData.image_url && (
                    <div className="mt-2 aspect-video rounded overflow-hidden border border-gray-200 bg-gray-50">
                      <img src={imageFormData.image_url} className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Alt Text</label>
                  <input 
                    type="text" 
                    placeholder="Brief description of the image"
                    value={imageFormData.alt_text}
                    onChange={(e) => setImageFormData({ ...imageFormData, alt_text: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setShowImageForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={editingImageId ? handleUpdateImage : handleAddImage}
                    disabled={isSaving}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-xl hover:bg-opacity-90 transition disabled:opacity-50 cursor-pointer"
                  >
                    {isSaving ? 'Saving...' : editingImageId ? 'Update' : 'Add Image'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
