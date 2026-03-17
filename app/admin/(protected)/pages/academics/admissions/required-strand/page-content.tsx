'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Edit2, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

interface Strand {
  id: number
  program: string
  strand_requirement: string
  order_index: number
  is_active: boolean
}

export default function RequiredStrandContent() {
  const [strands, setStrands] = useState<Strand[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ program: '', strand_requirement: '' })

  useEffect(() => {
    fetchStrands()
    setupRealtimeSubscription()
  }, [])

  const fetchStrands = async () => {
    try {
      const response = await fetch('/api/admissions/required-strands')
      if (response.ok) {
        const data = await response.json()
        setStrands(data)
      }
    } catch (error) {
      console.error('Error fetching strands:', error)
      toast.error('Failed to load strands')
    } finally {
      setIsLoading(false)
    }
  }

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('admissions_required_strands_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'admissions_required_strands' },
        () => {
          fetchStrands()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const handleAdd = async () => {
    if (!formData.program.trim() || !formData.strand_requirement.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/admissions/required-strands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Strand added')
        setFormData({ program: '', strand_requirement: '' })
        fetchStrands()
      } else {
        toast.error('Failed to add strand')
      }
    } catch (error) {
      console.error('Error adding strand:', error)
      toast.error('Error adding strand')
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdate = async (id: number) => {
    if (!formData.program.trim() || !formData.strand_requirement.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/admissions/required-strands/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Strand updated')
        setFormData({ program: '', strand_requirement: '' })
        setEditingId(null)
        fetchStrands()
      } else {
        toast.error('Failed to update strand')
      }
    } catch (error) {
      console.error('Error updating strand:', error)
      toast.error('Error updating strand')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this strand?')) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/admissions/required-strands/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Strand deleted')
        fetchStrands()
      } else {
        toast.error('Failed to delete strand')
      }
    } catch (error) {
      console.error('Error deleting strand:', error)
      toast.error('Error deleting strand')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (strand: Strand) => {
    setEditingId(strand.id)
    setFormData({ program: strand.program, strand_requirement: strand.strand_requirement })
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Required Strand per Program</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage program strand requirements</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preview Table */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Preview</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-white" style={{ backgroundColor: 'var(--primary-color)' }}>
                      <th className="px-4 py-3 text-left font-semibold text-sm md:text-base">Program</th>
                      <th className="px-4 py-3 text-left font-semibold text-sm md:text-base">Strand Requirement</th>
                      <th className="px-4 py-3 text-left font-semibold text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {strands.length > 0 ? (
                      strands.map((strand, index) => (
                        <tr
                          key={strand.id}
                          className={`border-b border-gray-200 dark:border-gray-700 ${
                            index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'
                          }`}
                        >
                          <td className="px-4 py-3 text-gray-900 dark:text-white text-sm md:text-base">{strand.program}</td>
                          <td className="px-4 py-3 text-gray-900 dark:text-white text-sm md:text-base">
                            {strand.strand_requirement}
                          </td>
                          <td className="px-4 py-3 flex gap-2">
                            <button
                              onClick={() => handleEdit(strand)}
                              className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(strand.id)}
                              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                          No strands added yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Add/Edit Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-fit">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {editingId ? 'Edit Strand' : 'Add Strand'}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                value={formData.program}
                onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                placeholder="Program name"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <input
                type="text"
                value={formData.strand_requirement}
                onChange={(e) => setFormData({ ...formData, strand_requirement: e.target.value })}
                placeholder="Strand requirements (e.g., STEM, ABM)"
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
                      setFormData({ program: '', strand_requirement: '' })
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
