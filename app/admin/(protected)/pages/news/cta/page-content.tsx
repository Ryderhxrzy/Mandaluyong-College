'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Upload, Trash2, Edit2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from 'next-cloudinary'
import NewsCTA from '@/components/news/NewsCTA'

interface CTAImage {
  id: number
  image_url: string
  order: number
}

interface CTASettings {
  id: number
  title: string
  description: string
  button_text: string
  button_link: string
  news_cta_images: CTAImage[]
}

export default function CTAContent() {
  const [cta, setCTA] = useState<CTASettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    button_text: '',
    button_link: '',
  })
  const [images, setImages] = useState<CTAImage[]>([])

  useEffect(() => {
    fetchCTA()
    setupRealtimeSubscription()
  }, [])

  const fetchCTA = async () => {
    try {
      const response = await fetch('/api/news/cta')
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setCTA(data)
          setFormData({
            title: data.title,
            description: data.description,
            button_text: data.button_text,
            button_link: data.button_link,
          })
          setImages(data.news_cta_images || [])
        }
      }
    } catch (error) {
      console.error('Error fetching CTA:', error)
      toast.error('Failed to load CTA settings')
    } finally {
      setIsLoading(false)
    }
  }

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('news_cta_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'news_cta' },
        () => {
          fetchCTA()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const handleCloudinaryUpload = async (results: CloudinaryUploadWidgetResults) => {
    if (
      results.event === 'success' &&
      results.info &&
      typeof results.info === 'object' &&
      'secure_url' in results.info
    ) {
      const url = (results.info as { secure_url: string }).secure_url
      
      if (cta) {
        try {
          const response = await fetch(`/api/admin/news/cta/images?cta_id=${cta.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image_url: url, order: images.length }),
          })
          
          if (response.ok) {
            toast.success('Image added successfully!')
            fetchCTA()
          } else {
            toast.error('Failed to add image')
          }
        } catch (error) {
          console.error('Error adding image:', error)
        }
      }
    }
  }

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm('Are you sure you want to delete this image?')) return
    
    try {
      const response = await fetch(`/api/admin/news/cta/images/${imageId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        toast.success('Image deleted')
        fetchCTA()
      } else {
        toast.error('Failed to delete image')
      }
    } catch (error) {
      console.error('Error deleting image:', error)
    }
  }

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in required fields')
      return
    }

    setIsSaving(true)
    try {
      if (cta) {
        const response = await fetch(`/api/admin/news/cta/${cta.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          toast.success('CTA updated successfully')
          setIsEditing(false)
          fetchCTA()
        } else {
          toast.error('Failed to update CTA')
        }
      }
    } catch (error) {
      console.error('Error saving CTA:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <Link
            href="/admin/pages/news"
            className="flex items-center gap-2 text-primary hover:text-[#003a7a] transition mb-4"
          >
            <ArrowLeft size={18} />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-outfit">News CTA Section</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage the call-to-action section content and images</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Preview Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
             <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
               <h2 className="text-lg font-semibold text-gray-900 dark:text-white font-outfit">Live Preview</h2>
             </div>
             <NewsCTA 
                title={formData.title} 
                description={formData.description} 
                buttonText={formData.button_text}
                buttonLink={formData.button_link}
                images={images}
             />
          </div>

          {/* Edit Panel */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white font-outfit">Content Settings</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition cursor-pointer"
                  >
                    <Edit2 size={16} />
                    Edit Content
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-md hover:bg-[#003a7a] transition cursor-pointer disabled:opacity-50"
                    >
                      <Save size={16} />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false)
                        setFormData({
                          title: cta?.title || '',
                          description: cta?.description || '',
                          button_text: cta?.button_text || '',
                          button_link: cta?.button_link || '',
                        })
                      }}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea
                    disabled={!isEditing}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg disabled:opacity-60"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Button Text</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.button_text}
                      onChange={(e) => setFormData(prev => ({ ...prev, button_text: e.target.value }))}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Button Link</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.button_link}
                      onChange={(e) => setFormData(prev => ({ ...prev, button_link: e.target.value }))}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg disabled:opacity-60"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white font-outfit">Images (Max 2)</h2>
                {images.length < 2 && (
                   <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                    onSuccess={handleCloudinaryUpload}
                  >
                    {({ open }) => (
                      <button
                        onClick={() => open()}
                        className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition cursor-pointer text-sm font-medium"
                      >
                        <Upload size={16} />
                        Add Image
                      </button>
                    )}
                  </CldUploadWidget>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {images.map((img) => (
                  <div key={img.id} className="relative group aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <button
                        onClick={() => handleDeleteImage(img.id)}
                        className="p-2 bg-white/20 hover:bg-red-500 text-white rounded-full transition-colors cursor-pointer"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
