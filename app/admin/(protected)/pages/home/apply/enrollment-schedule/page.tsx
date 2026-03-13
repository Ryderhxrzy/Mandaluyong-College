'use client'

import { useState, useCallback, useEffect } from 'react'
import { Trash2, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import ApplyEnrollmentSchedule from '@/components/apply/ApplyEnrollmentSchedule'

interface ScheduleItem {
  id: string
  date: string
  time: string
  yearLevel: string
  section: string
}

interface PageData {
  id: string
  title: string
  subtitle: string
  items: ScheduleItem[]
}

export default function EnrollmentSchedulePage() {
  const [pageData, setPageData] = useState<PageData>({
    id: '',
    title: 'Enrollment Schedule',
    subtitle: 'A.Y. 2025–2026 (1st Semester)',
    items: [],
  })

  const [headerData, setHeaderData] = useState({ title: '', subtitle: '' })
  const [editingHeader, setEditingHeader] = useState(false)
  const [editingItem, setEditingItem] = useState<Partial<ScheduleItem> | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isSavingHeader, setIsSavingHeader] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/apply/schedule')
      if (response.ok) {
        const data = await response.json()
        setPageData(data)
        setHeaderData({
          title: data.title,
          subtitle: data.subtitle,
        })
      }
    } catch (error) {
      console.error('Error fetching schedule data:', error)
      toast.error('Failed to load schedule data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleEditHeader = () => {
    setHeaderData({
      title: pageData.title,
      subtitle: pageData.subtitle,
    })
    setEditingHeader(true)
  }

  const handleSaveHeader = async () => {
    setIsSavingHeader(true)
    try {
      const response = await fetch('/api/admin/apply/schedule/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: headerData.title,
          subtitle: headerData.subtitle,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setPageData(prev => ({
          ...prev,
          ...data,
        }))
        setEditingHeader(false)
        toast.success('Header updated successfully!')
      } else {
        const errorMessage = data?.error || 'Failed to save header'
        console.error('Save header error:', errorMessage)
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error('Error saving header:', error)
      const errorMsg = error instanceof Error ? error.message : 'An error occurred while saving'
      toast.error(errorMsg)
    } finally {
      setIsSavingHeader(false)
    }
  }

  const handleAddItem = () => {
    setEditingItem({
      id: `new-${Date.now()}`,
      date: '',
      time: '',
      yearLevel: '',
      section: '',
    })
  }

  const handleEditItem = (item: ScheduleItem) => {
    setEditingItem({ ...item })
  }

  const handleSaveItem = async () => {
    if (!editingItem?.date || !editingItem?.time || !editingItem?.yearLevel) {
      toast.error('Please fill in all fields')
      return
    }

    setIsSaving(true)
    try {
      const isNewItem = editingItem.id?.toString().startsWith('new-')
      const updatedItems = isNewItem
        ? [
            ...pageData.items,
            {
              id: editingItem.id || `new-${Date.now()}`,
              date: editingItem.date,
              time: editingItem.time,
              yearLevel: editingItem.yearLevel,
              section: editingItem.section || '',
            } as ScheduleItem,
          ]
        : pageData.items.map(item =>
            item.id === editingItem.id
              ? {
                  id: item.id,
                  date: editingItem.date || item.date,
                  time: editingItem.time || item.time,
                  yearLevel: editingItem.yearLevel || item.yearLevel,
                  section: editingItem.section || item.section,
                }
              : item
          )

      const response = await fetch('/api/admin/apply/schedule/items/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: updatedItems,
        }),
      })

      if (response.ok) {
        setPageData(prev => ({
          ...prev,
          items: updatedItems,
        }))
        setEditingItem(null)
        toast.success(isNewItem ? 'Item added successfully!' : 'Item updated successfully!')
      } else {
        toast.error('Failed to save item')
      }
    } catch (error) {
      console.error('Error saving item:', error)
      toast.error('An error occurred while saving')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteItem = async (id: string) => {
    try {
      if (!id.toString().startsWith('new-')) {
        await fetch(`/api/admin/apply/schedule/items?id=${id}`, {
          method: 'DELETE',
        })
      }

      const updatedItems = pageData.items.filter(item => item.id !== id)
      setPageData(prev => ({
        ...prev,
        items: updatedItems,
      }))

      await fetch('/api/admin/apply/schedule/items/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: updatedItems,
        }),
      })

      toast.success('Item deleted successfully!')
    } catch (error) {
      console.error('Error deleting item:', error)
      toast.error('Failed to delete item')
    }
  }

  // Helper function to merge editing item with saved items for preview
  const getPreviewItems = () => {
    if (!editingItem) return pageData.items

    const isNewItem = editingItem.id?.toString().startsWith('new-')

    if (isNewItem) {
      // Include new item in preview
      return [
        ...pageData.items,
        {
          id: editingItem.id || `new-${Date.now()}`,
          date: editingItem.date || '',
          time: editingItem.time || '',
          yearLevel: editingItem.yearLevel || '',
          section: editingItem.section || '',
        },
      ]
    }

    // Update existing item in preview
    return pageData.items.map(item =>
      item.id === editingItem.id
        ? {
            id: item.id,
            date: editingItem.date || item.date,
            time: editingItem.time || item.time,
            yearLevel: editingItem.yearLevel || item.yearLevel,
            section: editingItem.section || item.section,
          }
        : item
    )
  }

  if (isLoading) {
    return (
      <div className="p-6 w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Apply - Enrollment Schedule
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Apply - Enrollment Schedule
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {editingItem ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Edit Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="text"
                  value={editingItem.date || ''}
                  onChange={e => setEditingItem({ ...editingItem, date: e.target.value })}
                  placeholder="e.g., June 16, 2025"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Time
                </label>
                <input
                  type="text"
                  value={editingItem.time || ''}
                  onChange={e => setEditingItem({ ...editingItem, time: e.target.value })}
                  placeholder="e.g., 8:00AM–12:00PM"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Year Level
                </label>
                <input
                  type="text"
                  value={editingItem.yearLevel || ''}
                  onChange={e => setEditingItem({ ...editingItem, yearLevel: e.target.value })}
                  placeholder="e.g., Incoming 1st Year"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Section (Optional)
                </label>
                <input
                  type="text"
                  value={editingItem.section || ''}
                  onChange={e => setEditingItem({ ...editingItem, section: e.target.value })}
                  placeholder="e.g., ABCOMM11 & BSIS11"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                />
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
                  disabled={isSaving}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-medium cursor-pointer hover:bg-[#003a7a] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : 'Save Item'}
                </button>
              </div>
            </div>

            {/* Live Preview */}
            <div className="space-y-4">
              <div className="flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10 py-2 border-b border-gray-100 dark:border-gray-700 mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Live Preview
                </h2>
                <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  Real-time View
                </span>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900 sticky top-14 max-h-[calc(100vh-250px)] overflow-y-auto shadow-sm">
                <ApplyEnrollmentSchedule
                  title={pageData.title}
                  subtitle={pageData.subtitle}
                  items={getPreviewItems()}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-8">
            {/* Header Section */}
            {editingHeader ? (
              <div className="space-y-4 p-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Edit Page Header
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={headerData.title || ''}
                      onChange={e => setHeaderData({ ...headerData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={headerData.subtitle || ''}
                      onChange={e => setHeaderData({ ...headerData, subtitle: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-blue-200 dark:border-blue-800">
                  <button
                    onClick={() => {
                      setEditingHeader(false)
                      setHeaderData({ title: pageData.title, subtitle: pageData.subtitle })
                    }}
                    className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveHeader}
                    disabled={isSavingHeader}
                    className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSavingHeader ? 'Saving...' : 'Update Header'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 p-6 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 border border-primary/20 dark:border-primary/30 rounded-lg">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Title
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                      {pageData.title}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Subtitle
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                      {pageData.subtitle}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleEditHeader}
                    className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-[#003a7a] transition cursor-pointer"
                  >
                    Edit Header
                  </button>
                </div>
              </div>
            )}

            {/* Preview Section */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Current Layout Preview
                </h2>
                <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm bg-gray-50 dark:bg-gray-900">
                <ApplyEnrollmentSchedule
                  title={editingHeader && headerData ? headerData.title : pageData.title}
                  subtitle={editingHeader && headerData ? headerData.subtitle : pageData.subtitle}
                  items={pageData.items}
                />
              </div>
            </div>

            {/* Manage Schedule Items Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Manage Schedule Items
                </h2>
                <button
                  onClick={handleAddItem}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-[#003a7a] transition cursor-pointer flex items-center gap-2"
                >
                  <Plus size={16} /> Add Item
                </button>
              </div>
              <div className="space-y-3">
                {pageData.items.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/70 transition"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-1">
                        <span className="font-bold text-primary">{item.date}</span>
                        <span className="text-gray-600 dark:text-gray-400">|</span>
                        <span className="text-gray-900 dark:text-white text-sm">{item.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <span>{item.yearLevel}</span>
                        {item.section && (
                          <>
                            <span>•</span>
                            <span>{item.section}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded cursor-pointer transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {pageData.items.length === 0 && (
                  <p className="text-center py-8 text-gray-500 italic text-sm">
                    No schedule items found. Create your first item!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
