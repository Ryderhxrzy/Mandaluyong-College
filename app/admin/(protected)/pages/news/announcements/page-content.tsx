'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Edit2, Save, X, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from 'next-cloudinary'
import LatestAnnouncements, { type Announcement } from '@/components/news/LatestAnnouncements'

export default function AnnouncementsContent() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    link_url: 'https://www.facebook.com/MandaluyongCST?_rdc=2&_rdr#',
  })

  useEffect(() => {
    fetchAnnouncements()
    setupRealtimeSubscription()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/news/announcements')
      if (response.ok) {
        const data = await response.json()
        setAnnouncements(data)
      }
    } catch (error) {
      console.error('Error fetching announcements:', error)
      toast.error('Failed to load announcements')
    } finally {
      setIsLoading(false)
    }
  }

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('news_announcements_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'news_announcements' },
        () => {
          fetchAnnouncements()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const handleCloudinaryUpload = (results: CloudinaryUploadWidgetResults) => {
    if (
      results.event === 'success' &&
      results.info &&
      typeof results.info === 'object' &&
      'secure_url' in results.info
    ) {
      const url = (results.info as { secure_url: string }).secure_url
      setFormData((prev) => ({ ...prev, image_url: url }))
      toast.success('Image uploaded successfully!')
    }
  }

  const handleAdd = async () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.image_url.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/news/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Announcement added')
        resetForm()
        fetchAnnouncements()
      } else {
        toast.error('Failed to add announcement')
      }
    } catch (error) {
      console.error('Error adding announcement:', error)
      toast.error('Error adding announcement')
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdate = async (id: number) => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.image_url.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/news/announcements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Announcement updated')
        resetForm()
        fetchAnnouncements()
      } else {
        toast.error('Failed to update announcement')
      }
    } catch (error) {
      console.error('Error updating announcement:', error)
      toast.error('Error updating announcement')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/news/announcements/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Announcement deleted')
        fetchAnnouncements()
      } else {
        toast.error('Failed to delete announcement')
      }
    } catch (error) {
      console.error('Error deleting announcement:', error)
      toast.error('Error deleting announcement')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (announcement: Announcement) => {
    setEditingId(announcement.id)
    setFormData({
      title: announcement.title,
      description: announcement.description,
      image_url: announcement.image_url,
      link_url: announcement.link_url || 'https://www.facebook.com/MandaluyongCST?_rdc=2&_rdr#',
    })
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      title: '',
      description: '',
      image_url: '',
      link_url: 'https://www.facebook.com/MandaluyongCST?_rdc=2&_rdr#',
    })
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">News Announcements</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage the latest announcements cards</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main List and Preview */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white font-outfit">Preview (Live)</h2>
              </div>
              <LatestAnnouncements initialAnnouncements={announcements} />
            </div>

            {/* List of Management Cards */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
               <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white font-outfit">Manage Items</h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {announcements.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">No announcements found. Add one on the right.</div>
                ) : (
                  announcements.map((item) => (
                    <div key={item.id} className="p-6 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="h-16 w-24 relative rounded overflow-hidden flex-shrink-0">
                          <img src={item.image_url} alt="" className="object-cover w-full h-full" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{item.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-md transition cursor-pointer"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-md transition cursor-pointer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Form Side - STICKY */}
          <div className="lg:sticky lg:top-8 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 font-outfit">
                {editingId ? 'Edit Announcement' : 'Add New Announcement'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                    placeholder="e.g. Bachelor of Science in Nursing"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                    placeholder="Short description..."
                  />
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Redirection Link (URL) *</label>
                   <input
                    type="text"
                    value={formData.link_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image *</label>
                  <div className="space-y-2">
                    {formData.image_url && (
                      <div className="relative h-40 w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <img src={formData.image_url} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <CldUploadWidget
                      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                      onSuccess={handleCloudinaryUpload}
                    >
                      {({ open }) => (
                        <button
                          type="button"
                          onClick={() => open()}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors cursor-pointer"
                        >
                          <Upload size={18} />
                          {formData.image_url ? 'Change Image' : 'Upload Image'}
                        </button>
                      )}
                    </CldUploadWidget>
                  </div>
                </div>

                <div className="pt-4 flex gap-2">
                  <button
                    onClick={() => (editingId ? handleUpdate(editingId) : handleAdd())}
                    disabled={isSaving}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Save size={18} />
                    {editingId ? 'Update' : 'Add'}
                  </button>
                  {editingId && (
                    <button
                      onClick={resetForm}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
