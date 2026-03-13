'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Search, X } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import toast from 'react-hot-toast'
import { HexColorPicker } from 'react-colorful'
import EducationCommitment, { CommitmentItem } from '@/components/home/EducationCommitment'
import ColorPalettePicker, { ColorPalette } from '@/components/admin/ColorPalettePicker'
import IconPicker from '@/components/admin/IconPicker'

interface DBCommitmentItem {
  id: number
  title: string
  subtitle: string
  icon: string
  icon_color: string
  icon_bg_color_light: string
  icon_bg_color_dark: string
  icon_title: string
  icon_title_color: string
  value: string
  description: string
  order: number
  is_active: boolean
}

export default function EducationCommitmentAdminPage() {
  const [items, setItems] = useState<DBCommitmentItem[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingItem, setEditingItem] = useState<Partial<DBCommitmentItem> | null>(null)
  const [sectionTitle, setSectionTitle] = useState('Our Commitment to Quality Education and Innovation')
  const [sectionSubtitle, setSectionSubtitle] = useState('At Mandaluyong College of Science and Technology, we strive to provide accessible, high-quality education that empowers our students.')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Icon Picker State
  const [showIconPicker, setShowIconPicker] = useState(false)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/home/education-commitment`)
      if (response.ok) {
        const data = await response.json()
        setItems(data)
        if (data.length > 0) {
          if (data[0].title) setSectionTitle(data[0].title)
          if (data[0].description) setSectionSubtitle(data[0].description)
        }
      }
    } catch (error) {
      console.error('Error fetching commitment items:', error)
      toast.error('Failed to load items')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateHeader = async () => {
    if (!sectionTitle.trim() || !sectionSubtitle.trim()) {
      toast.error('Title and Subtitle are required')
      return
    }

    setIsSaving(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/home/education-commitment/header`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: sectionTitle,
          description: sectionSubtitle
        })
      })

      if (response.ok) {
        toast.success('Section header updated for all items!')
        // Refresh items to show updated headers (though usually and in preview it's already updated local state)
        fetchItems()
      } else {
        toast.error('Failed to update header')
      }
    } catch (error) {
      console.error('Error updating header:', error)
      toast.error('An error occurred while updating header')
    } finally {
      setIsSaving(false)
    }
  }

  const applyPalette = (palette: ColorPalette) => {
    if (editingItem) {
      setEditingItem({
        ...editingItem,
        icon_color: palette.color,
        icon_title_color: palette.color,
        icon_bg_color_light: palette.bgLight,
        icon_bg_color_dark: palette.bgDark
      })
      toast.success(`${palette.name} palette applied!`)
    }
  }

  const handleAddItem = () => {
    setEditingItem({
      id: undefined,
      title: sectionTitle,
      description: sectionSubtitle,
      icon: 'ShieldCheck',
      icon_color: '#2563eb',
      icon_bg_color_light: '#eff6ff',
      icon_bg_color_dark: '#1e293b',
      icon_title: '',
      icon_title_color: '#2563eb',
      value: '', // This will hold the individual item description
      order: items.length + 1,
      is_active: true
    })
    setIsEditing(true)
  }

  const handleEditItem = (item: DBCommitmentItem) => {
    setEditingItem(item)
    setIsEditing(true)
  }

  const handleDeleteItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/home/education-commitment/save`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })

      if (response.ok) {
        setItems(items.filter(item => item.id !== id))
        toast.success('Item deleted successfully!')
      } else {
        toast.error('Failed to delete item')
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      toast.error('An error occurred while deleting')
    }
  }

  const handleSaveItem = async () => {
    if (!editingItem?.icon_title || !editingItem?.icon || !editingItem?.value) {
      toast.error('Title, Icon, and Content are required')
      return
    }

    setIsSaving(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/home/education-commitment/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingItem,
          section_title: sectionTitle,
          section_description: sectionSubtitle
        })
      })

      const result = await response.json()
      if (response.ok) {
        const savedItem = result.data
        if (editingItem.id) {
          setItems(items.map(item => item.id === savedItem.id ? savedItem : item))
        } else {
          setItems([...items, savedItem])
        }
        toast.success('Item saved successfully!')
        setIsEditing(false)
        setEditingItem(null)
      } else {
        toast.error(result.error || 'Failed to save item')
      }
    } catch (error) {
      console.error('Error saving item:', error)
      toast.error('An error occurred while saving')
    } finally {
      setIsSaving(false)
    }
  }

  const mapToPreviewItems = (dbItems: DBCommitmentItem[]): CommitmentItem[] => {
    return dbItems.map(item => ({
      id: String(item.id),
      icon: item.icon,
      description: item.value || '', // Item content is stored in 'value'
      iconTitle: item.icon_title,
      iconColor: item.icon_color,
      bgColorLight: item.icon_bg_color_light,
      bgColorDark: item.icon_bg_color_dark,
      title: sectionTitle
    }))
  }

  const getPreviewItems = (): DBCommitmentItem[] => {
    if (!editingItem) return items;
    if (editingItem.id) {
      return items.map(item => item.id === editingItem.id ? (editingItem as DBCommitmentItem) : item);
    }
    return [...items, editingItem as DBCommitmentItem];
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Education Commitment
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {isEditing && editingItem ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="space-y-6">
              <div className="pb-6 border-b border-gray-200 dark:border-gray-700 space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Section Header (Title & Subtitle)
                  </label>
                  <input
                    type="text"
                    value={sectionTitle}
                    onChange={(e) => setSectionTitle(e.target.value)}
                    placeholder="Section Title"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <textarea
                    value={sectionSubtitle}
                    onChange={(e) => setSectionSubtitle(e.target.value)}
                    placeholder="Section Subtitle"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={handleUpdateHeader}
                    disabled={isSaving}
                    className="self-end px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSaving ? 'Saving...' : 'Update'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Item Title</label>
                <input
                  type="text"
                  value={editingItem.icon_title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, icon_title: e.target.value })}
                  placeholder="e.g., Collaborating for a Brighter Future"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Item Description (Content)</label>
                <textarea
                  value={editingItem.value || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, value: e.target.value })}
                  rows={3}
                  placeholder="The text that appears inside the card"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Icon</label>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    {/* @ts-ignore */}
                    {editingItem.icon && LucideIcons[editingItem.icon] ? (
                      // @ts-ignore
                      React.createElement(LucideIcons[editingItem.icon], { size: 24 })
                    ) : <LucideIcons.HelpCircle size={24} />}
                  </div>
                  <button
                    onClick={() => setShowIconPicker(true)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-200 cursor-pointer"
                  >
                    Change Icon
                  </button>
                </div>
              </div>

              <ColorPalettePicker onSelect={applyPalette} />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Icon Color</label>
                  <HexColorPicker
                    color={editingItem.icon_color}
                    onChange={(color) => setEditingItem({ ...editingItem, icon_color: color, icon_title_color: color })}
                  />
                  <input
                    type="text"
                    value={editingItem.icon_color}
                    onChange={(e) => setEditingItem({ ...editingItem, icon_color: e.target.value })}
                    className="w-full mt-2 px-2 py-1 text-xs border border-gray-300 rounded uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">BG Light</label>
                  <HexColorPicker
                    color={editingItem.icon_bg_color_light}
                    onChange={(color) => setEditingItem({ ...editingItem, icon_bg_color_light: color })}
                  />
                  <input
                    type="text"
                    value={editingItem.icon_bg_color_light}
                    onChange={(e) => setEditingItem({ ...editingItem, icon_bg_color_light: e.target.value })}
                    className="w-full mt-2 px-2 py-1 text-xs border border-gray-300 rounded uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">BG Dark</label>
                  <HexColorPicker
                    color={editingItem.icon_bg_color_dark}
                    onChange={(color) => setEditingItem({ ...editingItem, icon_bg_color_dark: color })}
                  />
                  <input
                    type="text"
                    value={editingItem.icon_bg_color_dark}
                    onChange={(e) => setEditingItem({ ...editingItem, icon_bg_color_dark: e.target.value })}
                    className="w-full mt-2 px-2 py-1 text-xs border border-gray-300 rounded uppercase"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveItem}
                  disabled={isSaving}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-medium cursor-pointer"
                >
                  {isSaving ? 'Saving...' : 'Save Item'}
                </button>
              </div>
            </div>

            {/* Preview Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10 py-2 border-b border-gray-100 dark:border-gray-700 mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Live Preview</h2>
                <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Real-time View</span>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900 sticky top-14 max-h-[calc(100vh-250px)] overflow-y-auto shadow-sm">
                <EducationCommitment 
                  title={sectionTitle} 
                  subtitle={sectionSubtitle}
                  items={mapToPreviewItems(getPreviewItems())} 
                  forceSingleColumn={true}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="pb-6 border-b border-gray-200 dark:border-gray-700 space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Section Header (Title & Subtitle)
                  </label>
                  <input
                    type="text"
                    value={sectionTitle}
                    onChange={(e) => setSectionTitle(e.target.value)}
                    placeholder="Section Title"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                  <textarea
                    value={sectionSubtitle}
                    onChange={(e) => setSectionSubtitle(e.target.value)}
                    placeholder="Section Subtitle"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                  <button
                    onClick={handleUpdateHeader}
                    disabled={isSaving}
                    className="self-end px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSaving ? 'Saving...' : 'Update'}
                  </button>
                </div>
              </div>

            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Current Homepage Layout</h2>
                <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                <EducationCommitment 
                  title={sectionTitle} 
                  subtitle={sectionSubtitle}
                  items={mapToPreviewItems(items.filter(i => i.is_active))} 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Manage Commitment Items</h2>
                <button
                  onClick={handleAddItem}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-[#003a7a] transition cursor-pointer flex items-center gap-2"
                >
                  <Plus size={16} /> Add New Item
                </button>
              </div>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
                        style={{ backgroundColor: item.icon_bg_color_light }}
                      >
                        {/* @ts-ignore */}
                        {LucideIcons[item.icon] ? React.createElement(LucideIcons[item.icon], { size: 20, color: item.icon_color }) : <LucideIcons.HelpCircle size={20} />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{item.icon_title}</p>
                        <p className="text-xs text-gray-500 truncate max-w-md">{item.value}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                {items.length === 0 && (
                  <p className="text-center py-10 text-gray-500 italic">No items found.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {showIconPicker && editingItem && (
        <IconPicker
          selectedIcon={editingItem.icon || ''}
          onSelect={(iconName) => {
            setEditingItem({ ...editingItem, icon: iconName })
            setShowIconPicker(false)
          }}
          onClose={() => setShowIconPicker(false)}
        />
      )}
    </div>
  )
}
