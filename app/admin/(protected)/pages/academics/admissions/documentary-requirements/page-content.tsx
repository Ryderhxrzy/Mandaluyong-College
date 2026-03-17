'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Edit2, Save, X, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { CheckCircle } from 'lucide-react'

interface Requirement {
  id: number
  requirement_text: string
  requirement_type: string
  parent_requirement_id: number | null
  order_index: number
  is_active: boolean
}

interface GroupedRequirement extends Requirement {
  sub_requirements?: Requirement[]
}

export default function DocumentaryRequirementsContent() {
  const [requirements, setRequirements] = useState<GroupedRequirement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ requirement_text: '', requirement_type: 'main' })
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set())

  useEffect(() => {
    fetchRequirements()
    setupRealtimeSubscription()
  }, [])

  const fetchRequirements = async () => {
    try {
      const response = await fetch('/api/admissions/documentary-requirements')
      if (response.ok) {
        const data = await response.json()
        setRequirements(data)
      }
    } catch (error) {
      console.error('Error fetching requirements:', error)
      toast.error('Failed to load requirements')
    } finally {
      setIsLoading(false)
    }
  }

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('admissions_documentary_requirements_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'admissions_documentary_requirements' },
        () => {
          fetchRequirements()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const handleAdd = async () => {
    if (!formData.requirement_text.trim()) {
      toast.error('Please enter a requirement')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/admissions/documentary-requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Requirement added')
        setFormData({ requirement_text: '', requirement_type: 'main' })
        fetchRequirements()
      } else {
        toast.error('Failed to add requirement')
      }
    } catch (error) {
      console.error('Error adding requirement:', error)
      toast.error('Error adding requirement')
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdate = async (id: number) => {
    if (!formData.requirement_text.trim()) {
      toast.error('Please enter a requirement')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/admissions/documentary-requirements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Requirement updated')
        setFormData({ requirement_text: '', requirement_type: 'main' })
        setEditingId(null)
        fetchRequirements()
      } else {
        toast.error('Failed to update requirement')
      }
    } catch (error) {
      console.error('Error updating requirement:', error)
      toast.error('Error updating requirement')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this requirement?')) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/admissions/documentary-requirements/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Requirement deleted')
        fetchRequirements()
      } else {
        toast.error('Failed to delete requirement')
      }
    } catch (error) {
      console.error('Error deleting requirement:', error)
      toast.error('Error deleting requirement')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (requirement: Requirement) => {
    setEditingId(requirement.id)
    setFormData({ requirement_text: requirement.requirement_text, requirement_type: requirement.requirement_type })
  }

  const toggleGroup = (id: number) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedGroups(newExpanded)
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Documentary Requirements</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage required documents for admission</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preview Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Preview</h2>
              <div className="space-y-4">
                {requirements.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">No requirements added yet</p>
                ) : (
                  requirements.map((req) => (
                    <div key={req.id}>
                      <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <CheckCircle className="text-primary flex-shrink-0 mt-1" size={16} />
                        <div className="flex-1">
                          <p className="text-gray-700 dark:text-gray-300 font-medium">{req.requirement_text}</p>
                          {req.sub_requirements && req.sub_requirements.length > 0 && (
                            <button
                              onClick={() => toggleGroup(req.id)}
                              className="text-sm text-primary hover:underline mt-2 flex items-center gap-1"
                            >
                              {expandedGroups.has(req.id) ? (
                                <>
                                  <ChevronUp size={14} /> Hide sub-requirements
                                </>
                              ) : (
                                <>
                                  <ChevronDown size={14} /> Show sub-requirements
                                </>
                              )}
                            </button>
                          )}
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleEdit(req)}
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(req.id)}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      {expandedGroups.has(req.id) && req.sub_requirements && req.sub_requirements.length > 0 && (
                        <div className="ml-8 mt-2 space-y-2">
                          {req.sub_requirements.map((sub) => (
                            <div key={sub.id} className="flex items-start gap-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                              <CheckCircle className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" size={14} />
                              <div className="flex-1">
                                <p className="text-sm text-gray-700 dark:text-gray-300">{sub.requirement_text}</p>
                              </div>
                              <div className="flex gap-2 flex-shrink-0">
                                <button
                                  onClick={() => handleEdit(sub)}
                                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => handleDelete(sub.id)}
                                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Add/Edit Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-fit">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {editingId ? 'Edit Requirement' : 'Add Requirement'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
                <select
                  value={formData.requirement_type}
                  onChange={(e) => setFormData({ ...formData, requirement_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="main">Main Requirement</option>
                  <option value="sub">Sub-requirement</option>
                </select>
              </div>
              <textarea
                value={formData.requirement_text}
                onChange={(e) => setFormData({ ...formData, requirement_text: e.target.value })}
                placeholder="Enter requirement text"
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
                      setFormData({ requirement_text: '', requirement_type: 'main' })
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
