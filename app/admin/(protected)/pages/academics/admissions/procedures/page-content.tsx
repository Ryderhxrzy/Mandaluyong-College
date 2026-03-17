'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Edit2, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

interface Procedure {
  id: number
  step_number: number
  step_title: string
  step_description: string | null
  additional_info: string | null
  link_text: string | null
  link_url: string | null
  note_text: string | null
  note_type: string | null
  order_index: number
  is_active: boolean
}

export default function ProceduresContent() {
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    step_number: 1,
    step_title: '',
    step_description: '',
    additional_info: '',
    link_text: '',
    link_url: '',
    note_text: '',
    note_type: 'info',
  })

  useEffect(() => {
    fetchProcedures()
    setupRealtimeSubscription()
  }, [])

  const fetchProcedures = async () => {
    try {
      const response = await fetch('/api/admissions/admission-procedures')
      if (response.ok) {
        const data = await response.json()
        setProcedures(data)
      }
    } catch (error) {
      console.error('Error fetching procedures:', error)
      toast.error('Failed to load procedures')
    } finally {
      setIsLoading(false)
    }
  }

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('admissions_admission_procedures_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'admissions_admission_procedures' },
        () => {
          fetchProcedures()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const handleAdd = async () => {
    if (!formData.step_title.trim()) {
      toast.error('Please enter a step title')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/admissions/admission-procedures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Procedure added')
        setFormData({
          step_number: procedures.length + 1,
          step_title: '',
          step_description: '',
          additional_info: '',
          link_text: '',
          link_url: '',
          note_text: '',
          note_type: 'info',
        })
        fetchProcedures()
      } else {
        toast.error('Failed to add procedure')
      }
    } catch (error) {
      console.error('Error adding procedure:', error)
      toast.error('Error adding procedure')
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdate = async (id: number) => {
    if (!formData.step_title.trim()) {
      toast.error('Please enter a step title')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/admissions/admission-procedures/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Procedure updated')
        setFormData({
          step_number: 1,
          step_title: '',
          step_description: '',
          additional_info: '',
          link_text: '',
          link_url: '',
          note_text: '',
          note_type: 'info',
        })
        setEditingId(null)
        fetchProcedures()
      } else {
        toast.error('Failed to update procedure')
      }
    } catch (error) {
      console.error('Error updating procedure:', error)
      toast.error('Error updating procedure')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this procedure?')) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/admissions/admission-procedures/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Procedure deleted')
        fetchProcedures()
      } else {
        toast.error('Failed to delete procedure')
      }
    } catch (error) {
      console.error('Error deleting procedure:', error)
      toast.error('Error deleting procedure')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (procedure: Procedure) => {
    setEditingId(procedure.id)
    setFormData({
      step_number: procedure.step_number,
      step_title: procedure.step_title,
      step_description: procedure.step_description || '',
      additional_info: procedure.additional_info || '',
      link_text: procedure.link_text || '',
      link_url: procedure.link_url || '',
      note_text: procedure.note_text || '',
      note_type: procedure.note_type || 'info',
    })
  }

  const getNoteColor = (type: string | null) => {
    switch (type) {
      case 'error':
        return 'border-red-200 bg-red-50 dark:bg-red-900/20'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20'
      case 'info':
      default:
        return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20'
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
            href="/admin/pages/academics/admissions"
            className="flex items-center gap-2 text-primary hover:text-[#003a7a] transition mb-4"
          >
            <ArrowLeft size={18} />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admission Procedures</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage the step-by-step admission process</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preview Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Preview</h2>
              <div className="space-y-6">
                {procedures.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">No procedures added yet</p>
                ) : (
                  procedures.map((proc) => (
                    <div key={proc.id} className="relative">
                      <div className="flex gap-6">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                            {proc.step_number}
                          </div>
                          {procedures.indexOf(proc) < procedures.length - 1 && (
                            <div className="w-0.5 h-12 bg-primary/20 my-2"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{proc.step_title}</h3>
                          {proc.step_description && <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{proc.step_description}</p>}
                          {proc.additional_info && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{proc.additional_info}</p>
                          )}
                          {proc.link_url && (
                            <a
                              href={proc.link_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 dark:text-blue-400 underline mb-2 inline-block"
                            >
                              {proc.link_text || 'Download'}
                            </a>
                          )}
                          {proc.note_text && (
                            <div className={`border-l-4 p-3 rounded text-sm ${getNoteColor(proc.note_type)}`}>
                              <p className="text-gray-700 dark:text-gray-300">{proc.note_text}</p>
                            </div>
                          )}
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => handleEdit(proc)}
                              className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(proc.id)}
                              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
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
              {editingId ? 'Edit Procedure' : 'Add Procedure'}
            </h2>
            <div className="space-y-3">
              <input
                type="number"
                value={formData.step_number}
                onChange={(e) => setFormData({ ...formData, step_number: parseInt(e.target.value) })}
                placeholder="Step number"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
              <input
                type="text"
                value={formData.step_title}
                onChange={(e) => setFormData({ ...formData, step_title: e.target.value })}
                placeholder="Step title"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
              <textarea
                value={formData.step_description}
                onChange={(e) => setFormData({ ...formData, step_description: e.target.value })}
                placeholder="Description"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
              <textarea
                value={formData.additional_info}
                onChange={(e) => setFormData({ ...formData, additional_info: e.target.value })}
                placeholder="Additional info"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
              <input
                type="text"
                value={formData.link_text}
                onChange={(e) => setFormData({ ...formData, link_text: e.target.value })}
                placeholder="Link text (optional)"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
              <input
                type="url"
                value={formData.link_url}
                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                placeholder="Link URL (optional)"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
              <textarea
                value={formData.note_text}
                onChange={(e) => setFormData({ ...formData, note_text: e.target.value })}
                placeholder="Note (optional)"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
              <select
                value={formData.note_type}
                onChange={(e) => setFormData({ ...formData, note_type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="info">Info Note</option>
                <option value="warning">Warning Note</option>
                <option value="error">Error Note</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => (editingId ? handleUpdate(editingId) : handleAdd())}
                  disabled={isSaving}
                  className="flex-1 px-3 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                >
                  <Save size={16} />
                  {editingId ? 'Update' : 'Add'}
                </button>
                {editingId && (
                  <button
                    onClick={() => {
                      setEditingId(null)
                      setFormData({
                        step_number: 1,
                        step_title: '',
                        step_description: '',
                        additional_info: '',
                        link_text: '',
                        link_url: '',
                        note_text: '',
                        note_type: 'info',
                      })
                    }}
                    className="flex-1 px-3 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-400 transition cursor-pointer flex items-center justify-center gap-2 text-sm"
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
