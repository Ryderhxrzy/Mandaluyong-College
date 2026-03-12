'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import InstitutionalOverview, { OverviewItem } from '@/components/InstitutionalOverview'

const STATIC_DATA: OverviewItem[] = [
  {
    id: '1',
    icon: 'Users',
    value: '420+',
    label: 'Students Enrolled',
    color: 'text-primary',
    bgColorLight: 'bg-blue-100',
    bgColorDark: 'dark:bg-blue-900/30',
  },
  {
    id: '2',
    icon: 'Award',
    value: '20+',
    label: 'Faculty Members',
    color: 'text-green-600',
    bgColorLight: 'bg-green-100',
    bgColorDark: 'dark:bg-green-900/30',
  },
  {
    id: '3',
    icon: 'BookOpen',
    value: '5',
    label: 'Degree Programs',
    color: 'text-purple-600',
    bgColorLight: 'bg-purple-100',
    bgColorDark: 'dark:bg-purple-900/30',
  },
  {
    id: '4',
    icon: 'Target',
    value: '100%',
    label: 'Commitment to Excellence',
    color: 'text-amber-500',
    bgColorLight: 'bg-amber-100',
    bgColorDark: 'dark:bg-amber-900/30',
  },
]

export default function InstitutionalOverviewAdminPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [sectionTitle, setSectionTitle] = useState('Our Commitment to Academic Excellence')
  const [items, setItems] = useState<OverviewItem[]>(STATIC_DATA)

  // Temporary state for editing
  const [tempTitle, setTempTitle] = useState(sectionTitle)
  const [tempItems, setTempItems] = useState(items)
  const [isSaving, setIsSaving] = useState(false)

  const handleUpdateSectionTitle = async () => {
    if (!tempTitle.trim()) {
      toast.error('Section title cannot be empty')
      return
    }
    setIsSaving(true)
    setTimeout(() => {
      setSectionTitle(tempTitle)
      toast.success('Section title updated successfully!')
      setIsSaving(false)
    }, 600)
  }

  const handleItemChange = (id: string, field: string, value: string) => {
    setTempItems(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const handleSaveAll = async () => {
    setIsSaving(true)
    setTimeout(() => {
      setItems(tempItems)
      toast.success('Overview items saved successfully!')
      setIsSaving(false)
      setIsEditing(false)
    }, 800)
  }

  const handleCancel = () => {
    setTempTitle(sectionTitle)
    setTempItems(items)
    setIsEditing(false)
  }

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Institutional Overview
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {isEditing ? (
          <>
            {/* Grid Layout: Form (left) and Preview (right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Left: Form Inputs */}
              <div className="space-y-6">
                {/* Section Title Editor */}
                <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Section Title
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      placeholder="Enter section title"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      onClick={handleUpdateSectionTitle}
                      disabled={isSaving}
                      className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition disabled:opacity-50 cursor-pointer"
                    >
                      {isSaving ? 'Saving...' : 'Update'}
                    </button>
                  </div>
                </div>

                {/* Items Form */}
                <div className="space-y-4 pr-2">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Display Items</h3>
                  {tempItems.map((item) => (
                    <div key={item.id} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">Item {item.id}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1">Value</label>
                          <input
                            type="text"
                            value={item.value}
                            onChange={(e) => handleItemChange(item.id, 'value', e.target.value)}
                            className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-1 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1">Label</label>
                          <input
                            type="text"
                            value={item.label}
                            onChange={(e) => handleItemChange(item.id, 'label', e.target.value)}
                            className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Preview (Sticky) */}
              <div className="lg:sticky lg:top-6 self-start">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Preview
                </h2>
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
                  <InstitutionalOverview 
                    title={tempTitle} 
                    items={tempItems} 
                    className="!py-8"
                    containerClassName="!px-4"
                    columns={2}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end border-t border-gray-200 dark:border-gray-700 pt-6">
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-400 dark:hover:bg-gray-500 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAll}
                disabled={isSaving}
                className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition cursor-pointer disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Preview Only */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Preview
              </h2>
              <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <InstitutionalOverview title={sectionTitle} items={items} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition cursor-pointer"
              >
                Edit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
