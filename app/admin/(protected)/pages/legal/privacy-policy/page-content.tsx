'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Edit2, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

interface PolicySection {
  id: number
  content: string
  order: number
  is_active: boolean
}

export default function PrivacyPolicyContentAdmin() {
  const [sections, setSections] = useState<PolicySection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState<number | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({ content: '', order: 0 })

  useEffect(() => {
    fetchSections()
    const channel = supabase
      .channel('privacy_policy_sections_admin_rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'privacy_policy_sections' }, fetchSections)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const fetchSections = async () => {
    try {
      const { data } = await supabase.from('privacy_policy_sections').select('*').order('order', { ascending: true })
      if (data) setSections(data)
    } finally { setIsLoading(false) }
  }

  const handleSave = async () => {
    if (!formData.content) return
    setIsSaving(true)
    const url = isEditing ? `/api/admin/legal/privacy-policy-sections/${isEditing}` : '/api/admin/legal/privacy-policy-sections'
    const method = isEditing ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEditing ? { content: formData.content } : { ...formData, order: sections.length + 1 }),
      })
      if (res.ok) {
        toast.success('Saved successfully')
        setIsEditing(null)
        setIsAdding(false)
        setFormData({ content: '', order: sections.length + 1 })
        fetchSections()
      }
    } catch (e) { toast.error('Error saving') }
    finally { setIsSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this paragraph?')) return
    try {
      const res = await fetch(`/api/admin/legal/privacy-policy-sections/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Deleted')
        fetchSections()
      }
    } catch (e) { toast.error('Error deleting') }
  }

  if (isLoading) return <div className="p-8">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 font-sans">
      <div className="space-y-6 text-gray-900 dark:text-white">
        <div className="space-y-1">
          <Link href="/admin/pages/legal/privacy-policy-hero" className="flex items-center gap-2 text-primary hover:text-blue-700 font-bold mb-4">
            <ArrowLeft size={18} />
            Back
          </Link>
          <h1 className="text-3xl font-bold">Privacy Policy Content</h1>
          <p className="text-gray-500 font-medium italic">Manage the paragraphs on your Privacy Policy page</p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => {
              setIsAdding(true)
              setIsEditing(null)
              setFormData({ content: '', order: sections.length + 1 })
            }}
            className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition shadow flex items-center gap-2 cursor-pointer"
          >
            <Plus size={20} />
            Add Paragraph
          </button>

        </div>

        {(isAdding || isEditing !== null) && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
            <h2 className="text-lg font-semibold">{isEditing ? 'Edit Paragraph' : 'New Paragraph'}</h2>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
              placeholder="Paste paragraph content here..."
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary h-64"
            />
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button onClick={() => { setIsAdding(false); setIsEditing(null); }} className="px-6 py-2 bg-gray-300 dark:bg-gray-600 rounded-lg font-medium cursor-pointer">Cancel</button>
              <button onClick={handleSave} disabled={isSaving} className="px-8 py-2 bg-primary text-white rounded-lg font-medium cursor-pointer disabled:opacity-50">
                {isSaving ? 'Saving...' : 'Save Content'}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-xl font-bold border-b pb-2 dark:border-gray-700">Content Sections</h2>
          {sections.length === 0 ? (
            <div className="p-12 text-center text-gray-400 bg-white dark:bg-gray-800 rounded-lg border border-dashed font-medium italic">
              No content found.
            </div>
          ) : (
            sections.map(section => (
              <div key={section.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex items-start gap-4 hover:shadow-md transition group">
                <div className="flex-1 space-y-2">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                    {section.content}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsEditing(section.id)
                      setIsAdding(false)
                      setFormData({ content: section.content, order: section.order })
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(section.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
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
  )
}
