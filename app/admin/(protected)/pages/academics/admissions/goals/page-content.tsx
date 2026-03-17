'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Edit2, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import * as Icons from 'lucide-react'

interface Goal {
  id: number
  goal_text: string
  icon_name: string
  order_index: number
  is_active: boolean
}

export default function GoalsContent() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ goal_text: '', icon_name: 'BookOpen' })

  const lucideIcons = ['BookOpen', 'TrendingUp', 'Users', 'Zap', 'Globe', 'Award', 'Heart', 'Lightbulb', 'Target', 'Rocket']

  useEffect(() => {
    fetchGoals()
    setupRealtimeSubscription()
  }, [])

  const fetchGoals = async () => {
    try {
      const response = await fetch('/api/admissions/goals')
      if (response.ok) {
        const data = await response.json()
        setGoals(data)
      }
    } catch (error) {
      console.error('Error fetching goals:', error)
      toast.error('Failed to load goals')
    } finally {
      setIsLoading(false)
    }
  }

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('admissions_goals_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'admissions_goals' },
        () => {
          fetchGoals()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const handleAdd = async () => {
    if (!formData.goal_text.trim()) {
      toast.error('Please enter a goal')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/admissions/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Goal added')
        setFormData({ goal_text: '', icon_name: 'BookOpen' })
        fetchGoals()
      } else {
        toast.error('Failed to add goal')
      }
    } catch (error) {
      console.error('Error adding goal:', error)
      toast.error('Error adding goal')
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdate = async (id: number) => {
    if (!formData.goal_text.trim()) {
      toast.error('Please enter a goal')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/admissions/goals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Goal updated')
        setFormData({ goal_text: '', icon_name: 'BookOpen' })
        setEditingId(null)
        fetchGoals()
      } else {
        toast.error('Failed to update goal')
      }
    } catch (error) {
      console.error('Error updating goal:', error)
      toast.error('Error updating goal')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this goal?')) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/admissions/goals/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Goal deleted')
        fetchGoals()
      } else {
        toast.error('Failed to delete goal')
      }
    } catch (error) {
      console.error('Error deleting goal:', error)
      toast.error('Error deleting goal')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (goal: Goal) => {
    setEditingId(goal.id)
    setFormData({ goal_text: goal.goal_text, icon_name: goal.icon_name })
  }

  const getIcon = (iconName: string) => {
    const iconMap: Record<string, any> = {
      BookOpen: Icons.BookOpen,
      TrendingUp: Icons.TrendingUp,
      Users: Icons.Users,
      Zap: Icons.Zap,
      Globe: Icons.Globe,
      Award: Icons.Award,
      Heart: Icons.Heart,
      Lightbulb: Icons.Lightbulb,
      Target: Icons.Target,
      Rocket: Icons.Rocket,
    }
    return iconMap[iconName] || Icons.BookOpen
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admission Goals</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage the goals section</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preview Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Preview</h2>
              <div className="space-y-4">
                {goals.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">No goals added yet</p>
                ) : (
                  goals.map((goal) => {
                    const Icon = getIcon(goal.icon_name)
                    return (
                      <div
                        key={goal.id}
                        className="flex items-start gap-6 p-6 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                      >
                        <Icon className="text-primary flex-shrink-0 mt-1" size={28} />
                        <div className="flex-1">
                          <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg">{goal.goal_text}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleEdit(goal)}
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(goal.id)}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>

          {/* Add/Edit Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-fit">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {editingId ? 'Edit Goal' : 'Add Goal'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Icon</label>
                <select
                  value={formData.icon_name}
                  onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {lucideIcons.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                value={formData.goal_text}
                onChange={(e) => setFormData({ ...formData, goal_text: e.target.value })}
                placeholder="Enter goal text"
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
                      setFormData({ goal_text: '', icon_name: 'BookOpen' })
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
