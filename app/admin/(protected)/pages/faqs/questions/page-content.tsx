'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Edit2, Plus, Trash2, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

interface FaqItem {
  id: number
  question: string
  answer: string
  order: number
}

export default function FaqQuestionsContent() {
  const [questions, setQuestions] = useState<FaqItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [isEditing, setIsEditing] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    order: 0
  })

  useEffect(() => {
    fetchData()
    const channel = supabase
      .channel('faqs_items_admin_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'faqs_items' }, fetchData)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const fetchData = async () => {
    try {
      const { data } = await supabase.from('faqs_items').select('*').order('order', { ascending: true })
      if (data) setQuestions(data)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.question || !formData.answer) {
      toast.error('Question and Answer are required')
      return
    }
    setIsSaving(true)
    try {
      const method = isEditing ? 'PUT' : 'POST'
      const url = isEditing
        ? `/api/admin/faqs/questions/${isEditing}`
        : '/api/admin/faqs/questions'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success(`Question ${isEditing ? 'updated' : 'created'} successfully`)
        setIsAdding(false)
        setIsEditing(null)
        setFormData({ question: '', answer: '', order: questions.length + 1 })
        fetchData()
      } else {
        toast.error('Failed to save question')
      }
    } catch (error) { toast.error('Error saving question') }
    finally { setIsSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return
    try {
      const response = await fetch(`/api/admin/faqs/questions/${id}`, { method: 'DELETE' })
      if (response.ok) {
        toast.success('Question deleted')
        fetchData()
      }
    } catch (error) { toast.error('Error deleting question') }
  }

  if (isLoading) return <div className="p-8">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 font-sans">
      <div className="space-y-6 text-gray-900 dark:text-white">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <Link href="/admin/pages/faqs/hero" className="flex items-center gap-2 text-primary hover:text-[#003a7a] font-bold mb-4 transition">
              <ArrowLeft size={18} />
              Back
            </Link>
            <h1 className="text-3xl font-bold">FAQ Questions</h1>
            <p className="text-gray-500 font-medium">Add, edit, or remove questions from your FAQ page</p>
          </div>
          {!isAdding && isEditing === null && (
            <button
              onClick={() => {
                setIsAdding(true)
                setIsEditing(null)
                setFormData({ question: '', answer: '', order: questions.length + 1 })
              }}
              className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition shadow-sm cursor-pointer active:scale-95 flex items-center gap-2"
            >
              <Plus size={20} />
              New Question
            </button>
          )}
        </div>

        {/* Form Section */}
        {(isAdding || isEditing !== null) && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
            <h2 className="text-lg font-semibold">{isEditing ? 'Edit FAQ' : 'Add New FAQ'}</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <label className="block text-sm font-semibold mb-2">Question</label>
                  <input
                    type="text"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    placeholder="e.g. How do I enroll?"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary h-12"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Answer</label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  rows={5}
                  placeholder="Provide the detailed answer here..."
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => { setIsAdding(false); setIsEditing(null); }}
                className="px-6 py-2 bg-gray-300 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-400 dark:hover:bg-gray-500 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-8 py-2 bg-primary text-white rounded-lg font-medium shadow-sm cursor-pointer hover:bg-[#003a7a] active:scale-95 transition"
              >
                {isSaving ? 'Saving...' : 'Save FAQ'}
              </button>
            </div>
          </div>
        )}


        {/* List Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold border-b pb-2 dark:border-gray-700">All FAQs</h2>
          {questions.length === 0 ? (
            <div className="p-12 text-center text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-dashed font-medium italic">
              No questions found.
            </div>
          ) : (
            questions.map(q => (
              <div key={q.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex justify-between items-start gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400">#{q.order}</span>
                    <h3 className="text-lg font-bold">{q.question}</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {q.answer.length > 300 ? q.answer.substring(0, 300) + '...' : q.answer}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsEditing(q.id)
                      setIsAdding(false)
                      setFormData({
                        question: q.question,
                        answer: q.answer,
                        order: q.order
                      })
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition cursor-pointer"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition cursor-pointer"
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
