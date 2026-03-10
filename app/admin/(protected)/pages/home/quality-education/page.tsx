'use client'

import { useState } from 'react'

interface EducationCommitment {
  id: string
  icon: string
  title: string
  content: string
  background_color: string
  text_color: string
  icon_background_color: string
  order: number
  is_active: boolean
}

const STATIC_DATA: EducationCommitment[] = [
  {
    id: '1',
    icon: 'BookOpen',
    title: 'Quality Education',
    content: 'Rigorous curricula that combine theory and practical application.',
    background_color: '#f3f4f6',
    text_color: '#1f2937',
    icon_background_color: '#dbeafe',
    order: 1,
    is_active: true,
  },
  {
    id: '2',
    icon: 'Users',
    title: 'Expert Faculty',
    content: 'Experienced educators committed to student success and mentorship.',
    background_color: '#fef3c7',
    text_color: '#78350f',
    icon_background_color: '#fef08a',
    order: 2,
    is_active: true,
  },
  {
    id: '3',
    icon: 'Zap',
    title: 'Modern Facilities',
    content: 'State-of-the-art laboratories and learning spaces equipped with latest technology.',
    background_color: '#fee2e2',
    text_color: '#7f1d1d',
    icon_background_color: '#fecaca',
    order: 3,
    is_active: true,
  },
  {
    id: '4',
    icon: 'Globe',
    title: 'Global Perspective',
    content: 'International partnerships and programs fostering global competence.',
    background_color: '#d1fae5',
    text_color: '#065f46',
    icon_background_color: '#a7f3d0',
    order: 4,
    is_active: true,
  },
]

export default function EducationCommitmentPage() {
  const [items, setItems] = useState<EducationCommitment[]>(STATIC_DATA)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<EducationCommitment>>({})

  const handleEdit = (item: EducationCommitment) => {
    setEditingId(item.id)
    setEditData(item)
  }

  const handleInputChange = (field: string, value: any) => {
    setEditData({
      ...editData,
      [field]: value,
    })
  }

  const handleSave = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, ...editData } : item
      )
    )
    setEditingId(null)
  }

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Education Commitment
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
          >
            {editingId === item.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Title"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <textarea
                  value={editData.content || ''}
                  onChange={(e) =>
                    handleInputChange('content', e.target.value)
                  }
                  placeholder="Content"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  value={editData.icon || ''}
                  onChange={(e) => handleInputChange('icon', e.target.value)}
                  placeholder="Icon (e.g., BookOpen)"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-700 dark:text-gray-300 mb-1 block">
                      Background Color
                    </label>
                    <input
                      type="text"
                      value={editData.background_color || ''}
                      onChange={(e) =>
                        handleInputChange('background_color', e.target.value)
                      }
                      placeholder="e.g., #f0f0f0"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-700 dark:text-gray-300 mb-1 block">
                      Text Color
                    </label>
                    <input
                      type="text"
                      value={editData.text_color || ''}
                      onChange={(e) =>
                        handleInputChange('text_color', e.target.value)
                      }
                      placeholder="e.g., #333333"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-700 dark:text-gray-300 mb-1 block">
                      Icon BG Color
                    </label>
                    <input
                      type="text"
                      value={editData.icon_background_color || ''}
                      onChange={(e) =>
                        handleInputChange('icon_background_color', e.target.value)
                      }
                      placeholder="e.g., #ffffff"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`active-${item.id}`}
                    checked={editData.is_active || false}
                    onChange={(e) =>
                      handleInputChange('is_active', e.target.checked)
                    }
                  />
                  <label
                    htmlFor={`active-${item.id}`}
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    Active
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(item.id)}
                    className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-[#003a7a]"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded"
                onClick={() => handleEdit(item)}
                style={{
                  backgroundColor: item.background_color,
                  color: item.text_color,
                }}
              >
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm mt-1">{item.content}</p>
                <p className="text-xs mt-2 opacity-75">
                  {item.is_active ? '✓ Active' : '✗ Inactive'}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
        Changes are saved locally. Database integration coming soon...
      </p>
    </div>
  )
}
