'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Edit2, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { CheckCircle } from 'lucide-react'

interface Qualification {
  id: number
  qualification_text: string
  order_index: number
  is_active: boolean
}

export default function QualificationsContent() {
  const [qualifications, setQualifications] = useState<Qualification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ text: '' })
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    fetchQualifications()
    setupRealtimeSubscription()
  }, [])

  const fetchQualifications = async () => {
    try {
      const response = await fetch('/api/admissions/qualifications')
      if (response.ok) {
        const data = await response.json()
        setQualifications(data)
      }
    } catch (error) {
      console.error('Error fetching qualifications:', error)
      toast.error('Failed to load qualifications')
    } finally {
      setIsLoading(false)
    }
  }

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('admissions_qualifications_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'admissions_qualifications' },
        () => {
          fetchQualifications()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const handleAdd = async () => {
    if (!formData.text.trim()) {
      toast.error('Please enter a qualification')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/admissions/qualifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qualification_text: formData.text }),
      })

      if (response.ok) {
        toast.success('Qualification added')
        setFormData({ text: '' })
        fetchQualifications()
      } else {
        toast.error('Failed to add qualification')
      }
    } catch (error) {
      console.error('Error adding qualification:', error)
      toast.error('Error adding qualification')
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdate = async (id: number) => {
    if (!formData.text.trim()) {
      toast.error('Please enter a qualification')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/admissions/qualifications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qualification_text: formData.text }),
      })

      if (response.ok) {
        toast.success('Qualification updated')
        setFormData({ text: '' })
        setEditingId(null)
        fetchQualifications()
      } else {
        toast.error('Failed to update qualification')
      }
    } catch (error) {
      console.error('Error updating qualification:', error)
      toast.error('Error updating qualification')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this qualification?')) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/admissions/qualifications/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Qualification deleted')
        fetchQualifications()
      } else {
        toast.error('Failed to delete qualification')
      }
    } catch (error) {
      console.error('Error deleting qualification:', error)
      toast.error('Error deleting qualification')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (qualification: Qualification) => {
    setEditingId(qualification.id)
    setFormData({ text: qualification.qualification_text })
    setIsEditing(true)
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
            href="/admin/pages/academics/admissions"
            className="flex items-center gap-2 text-primary hover:text-[#003a7a] transition mb-4"
          >
            <ArrowLeft size={18} />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admissions Qualifications</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage the qualifications section</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preview Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Preview</h2>
              <div className="space-y-4">
                {qualifications.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">No qualifications added yet</p>
                ) : (
                  qualifications.map((qual) => (
                    <div key={qual.id} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <CheckCircle className="text-primary flex-shrink-0 mt-1" size={16} />
                      <span className="text-gray-700 dark:text-gray-300 flex-1">{qual.qualification_text}</span>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleEdit(qual)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(qual.id)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Add/Edit Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-fit">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {editingId ? 'Edit Qualification' : 'Add Qualification'}
            </h2>
            <div className="space-y-4">
              <textarea
                value={formData.text}
                onChange={(e) => setFormData({ text: e.target.value })}
                placeholder="Enter qualification text"
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => (editingId ? handleUpdate(editingId) : handleAdd())}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  {editingId ? 'Update' : 'Add'}
                </button>
                {editingId && (
                  <button
                    onClick={() => {
                      setEditingId(null)
                      setFormData({ text: '' })
                      setIsEditing(false)
                    }}
                    className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-400 transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
