'use client'

import { useState, useEffect } from 'react'
import React from 'react'
import * as LucideIcons from 'lucide-react'
import { Plus, Trash2, Edit2, Upload } from 'lucide-react'
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from 'next-cloudinary'
import toast from 'react-hot-toast'
import { supabaseAdmin } from '@/lib/supabase-admin'
import IconPicker from '@/components/admin/IconPicker'
import FeaturedPrograms, { type FeaturedProgramCard } from '@/components/academics/programs/FeaturedPrograms'


const DEFAULT_CARDS: FeaturedProgramCard[] = [
  {
    id: '1',
    icon: 'Megaphone',
    title: 'Bachelor of Arts in Communication',
    description:
      'Develop strong communication skills across various media platforms and prepare for careers in journalism, public relations, broadcasting, and digital media.',
    duration: '4 years',
    requiredStrand: 'All Strands',
    backgroundImage: '/1.webp',
    status: 'available',
  },
  {
    id: '2',
    icon: 'Cpu',
    title: 'Bachelor of Science in Information Systems',
    description:
      'Learn to design, implement, and manage information systems that support business operations and decision-making in the digital age.',
    duration: '4 years',
    requiredStrand: 'STEM, TVL-ICT',
    backgroundImage: '/2.webp',
    status: 'available',
  },
  {
    id: '3',
    icon: 'Sigma',
    title: 'Bachelor of Science in Mathematics',
    description:
      'Build a strong foundation in mathematical theory and applications, preparing for careers in education, research, data analysis, and various STEM fields.',
    duration: '4 years',
    requiredStrand: 'STEM, ABM',
    backgroundImage: '/3.webp',
    status: 'available',
  },
  {
    id: '4',
    icon: 'Building2',
    title: 'Bachelor of Public Administration',
    description:
      'Prepare for leadership roles in government and public service, focusing on policy analysis, public management, and civic engagement.',
    duration: '4 years',
    requiredStrand: 'All Strands',
    isNew: true,
    status: 'coming-soon',
  },
  {
    id: '5',
    icon: 'Activity',
    title: 'Bachelor of Physical Education',
    description:
      'Develop expertise in physical fitness, sports science, and health education to become effective physical education teachers and fitness professionals.',
    duration: '4 years',
    requiredStrand: 'All Strands',
    isNew: true,
    status: 'coming-soon',
  },
  {
    id: '6',
    icon: 'Heart',
    title: 'Bachelor of Science in Nursing',
    description:
      'Gain comprehensive knowledge and practical skills in nursing, preparing for a rewarding career in healthcare, patient care, and community health services.',
    duration: '4 years',
    requiredStrand: 'All Strands',
    isNew: true,
    status: 'coming-soon',
  },
]

export default function FeaturedProgramsPage() {
  const [title, setTitle] = useState('Our Featured Programs')
  const [subtitle, setSubtitle] = useState('Discover academic paths tailored for your success.')
  const [items, setItems] = useState<FeaturedProgramCard[]>(DEFAULT_CARDS)
  const [editingItem, setEditingItem] = useState<FeaturedProgramCard | null>(null)
  const [showIconPicker, setShowIconPicker] = useState(false)
  const [isSavingHeader, setIsSavingHeader] = useState(false)

  const activeCards = items.filter(card => card.status === 'available')
  const comingSoonCards = items.filter(card => card.status === 'coming-soon')

  const handleAddActiveCourse = () => {
    setEditingItem({
      id: String(Date.now()),
      icon: 'BookOpen',
      title: '',
      description: '',
      duration: '',
      requiredStrand: '',
      backgroundImage: '',
      status: 'available',
    })
  }

  const handleAddComingSoon = () => {
    setEditingItem({
      id: String(Date.now()),
      icon: 'BookOpen',
      title: '',
      description: '',
      duration: '',
      requiredStrand: '',
      backgroundImage: '',
      status: 'coming-soon',
      isNew: true,
    })
  }

  const handleEditItem = (item: FeaturedProgramCard) => {
    setEditingItem(item)
  }

  const handleDeleteItem = (id: string) => {
    if (!confirm('Are you sure you want to delete this program?')) return
    setItems(items.filter(item => item.id !== id))
    setEditingItem(null)
    toast.success('Program deleted!')
  }

  const handleSaveItem = () => {
    if (!editingItem?.title || !editingItem?.description) {
      toast.error('Title and description are required')
      return
    }

    const isNew = !items.some(item => item.id === editingItem.id)
    if (isNew) {
      setItems([...items, editingItem])
      toast.success('Program added successfully!')
    } else {
      setItems(items.map(item => item.id === editingItem.id ? editingItem : item))
      toast.success('Program updated successfully!')
    }
    setEditingItem(null)
  }

  const handleCloudinaryUpload = (results: CloudinaryUploadWidgetResults) => {
    if (
      results.event === 'success' &&
      results.info &&
      typeof results.info === 'object' &&
      'secure_url' in results.info
    ) {
      const imageUrl = (results.info as { secure_url: string }).secure_url
      setEditingItem({ ...editingItem!, backgroundImage: imageUrl })
    }
  }

  const handleSaveHeader = async () => {
    if (!title.trim() || !subtitle.trim()) {
      toast.error('Title and subtitle are required')
      return
    }

    setIsSavingHeader(true)
    try {
      const response = await fetch('/api/admin/programs/header/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, subtitle }),
      })

      if (response.ok) {
        toast.success('Header updated successfully!')
      } else {
        toast.error('Failed to update header')
      }
    } catch (error) {
      console.error('Error saving header:', error)
      toast.error('An error occurred while saving')
    } finally {
      setIsSavingHeader(false)
    }
  }

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Featured Programs
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-8">
        {/* Header Section */}
        <div className="pb-6 border-b border-gray-200 dark:border-gray-700 space-y-4">
          <div className="flex flex-col gap-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Section Header (Title & Subtitle)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Section Title"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-primary/20 outline-none"
            />
            <textarea
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Section Subtitle"
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
            />
            <button
              onClick={handleSaveHeader}
              disabled={isSavingHeader}
              className="self-end px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSavingHeader ? 'Updating...' : 'Update'}
            </button>
          </div>
        </div>

        {editingItem ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Form Inputs */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  value={editingItem.duration}
                  onChange={(e) => setEditingItem({ ...editingItem, duration: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Required Strand
                </label>
                <input
                  type="text"
                  value={editingItem.requiredStrand}
                  onChange={(e) => setEditingItem({ ...editingItem, requiredStrand: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Icon</label>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                    {editingItem.icon && (LucideIcons as Record<string, unknown>)[editingItem.icon] ? (
                      React.createElement((LucideIcons as Record<string, unknown>)[editingItem.icon] as React.ComponentType<{size: number}>, { size: 24 })
                    ) : <LucideIcons.BookOpen size={24} />}
                  </div>
                  <button
                    onClick={() => setShowIconPicker(true)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                  >
                    Change Icon
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Image</label>
                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                  onSuccess={handleCloudinaryUpload}
                >
                  {({ open }) => (
                    <button
                      onClick={() => open()}
                      className="w-full px-4 py-3 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Upload size={18} />
                      {editingItem.backgroundImage ? 'Change Image' : 'Upload Image'}
                    </button>
                  )}
                </CldUploadWidget>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setEditingItem(null)}
                  className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveItem}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition cursor-pointer"
                >
                  Save Program
                </button>
              </div>
            </div>

            {/* Right: Preview */}
            <div className="flex flex-col lg:col-span-2">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preview</h4>
              <div className="border border-gray-300 rounded-xl overflow-hidden bg-white dark:bg-gray-700 flex-1">
                <div className="w-full h-full overflow-y-auto">
                  <FeaturedPrograms
                    title={title}
                    subtitle={subtitle}
                    cards={editingItem.status === 'available'
                      ? [...activeCards, editingItem]
                      : [...comingSoonCards, editingItem]
                    }
                    cols={2}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Preview
              </h2>
              <FeaturedPrograms title={title} subtitle={subtitle} cards={items} />
            </div>

            {/* Items Management */}
            <div className="space-y-8 border-t border-gray-200 dark:border-gray-700 pt-8">
          {/* Active Courses Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Courses</h2>
              <button
                onClick={handleAddActiveCourse}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-[#003a7a] transition cursor-pointer flex items-center gap-2"
              >
                <Plus size={16} /> Add Program
              </button>
            </div>
            <div className="space-y-3">
              {activeCards.length === 0 ? (
                <p className="text-center py-10 text-gray-500 dark:text-gray-400 italic">No active courses. Create your first program!</p>
              ) : (
                activeCards.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl"
                  >
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 dark:text-white">{item.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-md">{item.duration} • {item.requiredStrand}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-1"
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Coming Soon Courses Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Coming Soon Courses</h2>
              <button
                onClick={handleAddComingSoon}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 transition cursor-pointer flex items-center gap-2"
              >
                <Plus size={16} /> Add Program
              </button>
            </div>
            <div className="space-y-3">
              {comingSoonCards.length === 0 ? (
                <p className="text-center py-10 text-gray-500 dark:text-gray-400 italic">No coming soon courses. Create your first program!</p>
              ) : (
                comingSoonCards.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl"
                  >
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 dark:text-white">{item.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-md">{item.duration} • {item.requiredStrand}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-1"
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded cursor-pointer"
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
          </>
        )}
      </div>

      {/* Icon Picker Modal */}
      {showIconPicker && editingItem && (
        <IconPicker
          onSelect={(icon) => {
            setEditingItem({ ...editingItem, icon })
            setShowIconPicker(false)
          }}
          onClose={() => setShowIconPicker(false)}
        />
      )}
    </div>
  )
}
