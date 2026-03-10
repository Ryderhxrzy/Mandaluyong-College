'use client'

import { useState } from 'react'

interface AcademicProgram {
  id: string
  name: string
  description: string
  order: number
  is_active: boolean
}

const STATIC_DATA: AcademicProgram[] = [
  {
    id: '1',
    name: 'Bachelor of Science in Computer Science',
    description:
      'Comprehensive program covering software development, data science, and artificial intelligence.',
    order: 1,
    is_active: true,
  },
  {
    id: '2',
    name: 'Bachelor of Science in Information Technology',
    description:
      'Focus on IT infrastructure, network management, and cybersecurity.',
    order: 2,
    is_active: true,
  },
  {
    id: '3',
    name: 'Bachelor of Science in Engineering',
    description:
      'Diverse engineering specializations including civil, mechanical, and electrical engineering.',
    order: 3,
    is_active: true,
  },
  {
    id: '4',
    name: 'Bachelor of Science in Business Administration',
    description:
      'Management and entrepreneurship program preparing students for business leadership.',
    order: 4,
    is_active: true,
  },
  {
    id: '5',
    name: 'Bachelor of Science in Education',
    description:
      'Teacher preparation program emphasizing innovative educational methodologies.',
    order: 5,
    is_active: true,
  },
]

export default function AcademicProgramsPage() {
  const [items, setItems] = useState<AcademicProgram[]>(STATIC_DATA)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<AcademicProgram>>({})

  const handleEdit = (item: AcademicProgram) => {
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
        Academic Programs
      </h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
          >
            {editingId === item.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Program Name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <textarea
                  value={editData.description || ''}
                  onChange={(e) =>
                    handleInputChange('description', e.target.value)
                  }
                  placeholder="Description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
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
              >
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {item.description}
                </p>
                <p className="text-xs text-gray-500 mt-2">
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
