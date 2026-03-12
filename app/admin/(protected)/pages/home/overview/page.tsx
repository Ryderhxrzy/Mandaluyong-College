'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Search, X } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import toast from 'react-hot-toast'
import { HexColorPicker } from 'react-colorful'
import InstitutionalOverview, { OverviewItem } from '@/components/InstitutionalOverview'

interface DBOverviewItem {
  id: number
  title: string
  icon: string
  icon_color: string
  icon_bg_color_light: string
  icon_bg_color_dark: string
  icon_title: string
  icon_title_color: string
  value: string
  order: number
  is_active: boolean
}

// Helper to get all Lucide icon names safely
const getLucideIconNames = () => {
  try {
    const names = Object.keys(LucideIcons).filter(
      (name) => 
        // @ts-ignore
        typeof LucideIcons[name] === 'function' || 
        // @ts-ignore
        (typeof LucideIcons[name] === 'object' && LucideIcons[name].displayName)
    ).filter(name => name !== 'createLucideIcon' && name[0] === name[0].toUpperCase())
    
    return names.length > 0 ? names.sort() : ['Users', 'Award', 'BookOpen', 'Target', 'GraduationCap', 'School', 'Library']
  } catch (e) {
    return ['Users', 'Award', 'BookOpen', 'Target', 'GraduationCap', 'School', 'Library']
  }
}

const ALL_ICONS = getLucideIconNames()

const COLOR_PALETTES = [
  // Primary & Professional
  { name: 'Deep Blue', color: '#003a7a', bgLight: '#ebf2fa', bgDark: '#1e293b' },
  { name: 'Success Green', color: '#16a34a', bgLight: '#f0fdf4', bgDark: '#14532d' },
  { name: 'Royal Purple', color: '#9333ea', bgLight: '#faf5ff', bgDark: '#581c87' },
  { name: 'Amber Glow', color: '#f59e0b', bgLight: '#fffbeb', bgDark: '#78350f' },
  { name: 'Danger Red', color: '#dc2626', bgLight: '#fef2f2', bgDark: '#7f1d1d' },
  { name: 'Ocean Cyan', color: '#0891b2', bgLight: '#ecfeff', bgDark: '#164e63' },
  
  // Modern & Vibrant
  { name: 'Rose Pink', color: '#e11d48', bgLight: '#fff1f2', bgDark: '#4c0519' },
  { name: 'Indigo Night', color: '#4f46e5', bgLight: '#eef2ff', bgDark: '#1e1b4b' },
  { name: 'Teal Forest', color: '#0d9488', bgLight: '#f0fdfa', bgDark: '#134e4a' },
  { name: 'Orange Sunset', color: '#ea580c', bgLight: '#fff7ed', bgDark: '#431407' },
  { name: 'Slate Steel', color: '#475569', bgLight: '#f8fafc', bgDark: '#0f172a' },
  { name: 'Sky Blue', color: '#0284c7', bgLight: '#f0f9ff', bgDark: '#082f49' },
  
  // Soft & Pastel
  { name: 'Lavender Mist', color: '#a78bfa', bgLight: '#f5f3ff', bgDark: '#2e1065' },
  { name: 'Emerald Sea', color: '#34d399', bgLight: '#f0fdf4', bgDark: '#064e3b' },
  { name: 'Golden Sand', color: '#fbbf24', bgLight: '#fffbeb', bgDark: '#451a03' },
  { name: 'Cherry Blossom', color: '#f472b6', bgLight: '#fdf2f8', bgDark: '#500724' },
  { name: 'Midnight Violet', color: '#8b5cf6', bgLight: '#f5f3ff', bgDark: '#1e1b4b' },
  { name: 'Tropical Lime', color: '#a3e635', bgLight: '#f7fee7', bgDark: '#1a2e05' },
  
  // Earthy & Deep
  { name: 'Bordeaux', color: '#be123c', bgLight: '#fff1f2', bgDark: '#4c0519' },
  { name: 'Forest Deep', color: '#15803d', bgLight: '#f0fdf4', bgDark: '#052e16' },
  { name: 'Coffee Brown', color: '#92400e', bgLight: '#fff7ed', bgDark: '#451a03' },
  { name: 'Obsidian', color: '#111827', bgLight: '#f9fafb', bgDark: '#030712' },
  { name: 'Electric Purple', color: '#a855f7', bgLight: '#f5f3ff', bgDark: '#3b0764' },
  { name: 'Cobalt', color: '#2563eb', bgLight: '#eff6ff', bgDark: '#1e3a8a' },

  // Sophisticated Neutrals
  { name: 'Taupe Gray', color: '#71717a', bgLight: '#f4f4f5', bgDark: '#27272a' },
  { name: 'Olive Drab', color: '#65a30d', bgLight: '#f7fee7', bgDark: '#1a2e05' },
  { name: 'Deep Navy', color: '#1e3a8a', bgLight: '#eff6ff', bgDark: '#172554' },
  { name: 'Ruby Wine', color: '#9f1239', bgLight: '#fff1f2', bgDark: '#4c0519' },
  { name: 'Charcoal', color: '#374151', bgLight: '#f3f4f6', bgDark: '#111827' },
  { name: 'Sandy Beach', color: '#d97706', bgLight: '#fffbeb', bgDark: '#451a03' }
]

export default function InstitutionalOverviewAdminPage() {
  const [items, setItems] = useState<DBOverviewItem[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingItem, setEditingItem] = useState<Partial<DBOverviewItem> | null>(null)
  const [sectionTitle, setSectionTitle] = useState('Our Commitment to Academic Excellence')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showAllPalettes, setShowAllPalettes] = useState(false)
  
  // Icon Picker State
  const [showIconPicker, setShowIconPicker] = useState(false)
  const [iconSearch, setIconSearch] = useState('')

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/home/overview`)
      if (response.ok) {
        const data = await response.json()
        setItems(data)
        if (data.length > 0 && data[0].title) {
          setSectionTitle(data[0].title)
        }
      }
    } catch (error) {
      console.error('Error fetching overview items:', error)
      toast.error('Failed to load overview items')
    } finally {
      setIsLoading(false)
    }
  }

  const applyPalette = (palette: typeof COLOR_PALETTES[0]) => {
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
      title: sectionTitle,
      icon: 'Users',
      icon_color: '#003a7a',
      icon_bg_color_light: '#ebf2fa',
      icon_bg_color_dark: '#1e293b',
      icon_title: '',
      icon_title_color: '#003a7a',
      value: '',
      order: items.length + 1,
      is_active: true
    })
    setIsEditing(true)
  }

  const handleEditItem = (item: DBOverviewItem) => {
    setEditingItem(item)
    setIsEditing(true)
  }

  const handleDeleteItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/home/overview/save`, {
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
    if (!editingItem?.icon_title || !editingItem?.icon) {
      toast.error('Icon and Title are required')
      return
    }

    setIsSaving(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/home/overview/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editingItem, section_title: sectionTitle })
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

  const handleUpdateSectionTitle = async () => {
    if (!sectionTitle.trim()) {
      toast.error('Section title cannot be empty')
      return
    }
    
    setIsSaving(true)
    try {
      toast.success('Section title updated! It will be saved with the next item edit.')
    } finally {
      setIsSaving(false)
    }
  }

  const filteredIcons = ALL_ICONS.filter(name => 
    name.toLowerCase().includes((iconSearch || '').toLowerCase())
  ).slice(0, 300)

  const mapToOverviewItems = (dbItems: DBOverviewItem[]): OverviewItem[] => {
    return dbItems.map(item => ({
      id: String(item.id),
      icon: item.icon,
      value: item.value,
      label: item.icon_title,
      color: item.icon_color,
      bgColorLight: item.icon_bg_color_light,
      bgColorDark: item.icon_bg_color_dark
    }))
  }

  const getPreviewItems = (): DBOverviewItem[] => {
    if (!editingItem) return items;
    
    // If editing an existing item
    if (editingItem.id) {
      return items.map(item => item.id === editingItem.id ? (editingItem as DBOverviewItem) : item);
    }
    
    // If adding a new item
    return [...items, editingItem as DBOverviewItem];
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Institutional Overview
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {isEditing && editingItem ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="space-y-6">
              <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Section Title
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sectionTitle}
                    onChange={(e) => setSectionTitle(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={handleUpdateSectionTitle}
                    className="px-4 py-2 bg-primary text-white rounded-lg cursor-pointer"
                  >
                    Update
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Value (e.g., 420+)</label>
                  <input
                    type="text"
                    value={editingItem.value || ''}
                    onChange={(e) => setEditingItem({...editingItem, value: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Label (e.g., Students)</label>
                  <input
                    type="text"
                    value={editingItem.icon_title || ''}
                    onChange={(e) => setEditingItem({...editingItem, icon_title: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Display Icon</label>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    {/* @ts-ignore */}
                    {ALL_ICONS.includes(editingItem.icon || '') ? (
                      // @ts-ignore
                      React.createElement(LucideIcons[editingItem.icon] || LucideIcons.Users, { size: 24 })
                    ) : <LucideIcons.Users size={24} />}
                  </div>
                  <button 
                    onClick={() => setShowIconPicker(true)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-200 cursor-pointer"
                  >
                    Change Icon
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Quick Color Palettes</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3 transition-all duration-300">
                  {(showAllPalettes ? COLOR_PALETTES : COLOR_PALETTES.slice(0, 6)).map((palette) => (
                    <button
                      key={palette.name}
                      onClick={() => applyPalette(palette)}
                      className="group flex flex-col items-center gap-1 p-2 rounded-lg border border-gray-100 hover:border-primary hover:bg-primary/5 transition cursor-pointer"
                      title={palette.name}
                    >
                      <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: palette.color }}></div>
                        <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: palette.bgLight }}></div>
                        <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: palette.bgDark }}></div>
                      </div>
                      <span className="text-[10px] font-medium text-gray-500 group-hover:text-primary truncate w-full text-center">{palette.name}</span>
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setShowAllPalettes(!showAllPalettes)}
                  className="w-full py-2 flex items-center justify-center gap-1 text-primary text-xs font-semibold border border-dashed border-gray-200 dark:border-gray-700 rounded-lg hover:bg-primary/5 transition cursor-pointer"
                >
                  {showAllPalettes ? 'Show Less' : 'Show All Colors'}
                  {showAllPalettes ? <LucideIcons.ChevronUp size={14} /> : <LucideIcons.ChevronDown size={14} />}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Theme Color</label>
                  <div className="space-y-2">
                    <HexColorPicker 
                      color={editingItem.icon_color} 
                      onChange={(color) => setEditingItem({...editingItem, icon_color: color, icon_title_color: color})} 
                    />
                    <input 
                      type="text" 
                      value={editingItem.icon_color} 
                      onChange={(e) => setEditingItem({...editingItem, icon_color: e.target.value})}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded uppercase"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Background (Light)</label>
                  <div className="space-y-2">
                    <HexColorPicker 
                      color={editingItem.icon_bg_color_light} 
                      onChange={(color) => setEditingItem({...editingItem, icon_bg_color_light: color})} 
                    />
                    <input 
                      type="text" 
                      value={editingItem.icon_bg_color_light} 
                      onChange={(e) => setEditingItem({...editingItem, icon_bg_color_light: e.target.value})}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded uppercase"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Background (Dark)</label>
                  <div className="space-y-2">
                    <HexColorPicker 
                      color={editingItem.icon_bg_color_dark} 
                      onChange={(color) => setEditingItem({...editingItem, icon_bg_color_dark: color})} 
                    />
                    <input 
                      type="text" 
                      value={editingItem.icon_bg_color_dark} 
                      onChange={(e) => setEditingItem({...editingItem, icon_bg_color_dark: e.target.value})}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded uppercase"
                    />
                  </div>
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

            {/* Preview */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white sticky top-0 bg-white dark:bg-gray-800 z-10 py-1">Live Preview</h2>
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-inner bg-gray-50 dark:bg-gray-900/50 sticky top-10 max-h-[70vh] overflow-y-auto">
                <InstitutionalOverview 
                  title={sectionTitle} 
                  items={mapToOverviewItems(getPreviewItems())} 
                  columns={2}
                  className="!py-10"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* List and Preview */}
            <div className="grid grid-cols-1 gap-8">
               {/* Preview Section */}
               <div className="relative">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Homepage Preview</h2>
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                  <InstitutionalOverview 
                    title={sectionTitle} 
                    items={mapToOverviewItems(items.filter(i => i.is_active))} 
                  />
                </div>
              </div>

              {/* Items Table/List */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Manage Items</h2>
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
                          className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--bg-light)] dark:bg-[var(--bg-dark)]"
                          style={{ 
                            // @ts-ignore
                            '--bg-light': item.icon_bg_color_light,
                            '--bg-dark': item.icon_bg_color_dark
                          }}
                        >
                          {/* @ts-ignore */}
                          {LucideIcons[item.icon] ? React.createElement(LucideIcons[item.icon], { size: 20, color: item.icon_color }) : <LucideIcons.Users size={20} />}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{item.value} {item.icon_title}</p>
                          <p className="text-xs text-gray-500">Order: {item.order} | Theme: {item.icon_color}</p>
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
          </div>
        )}
      </div>

      {/* Icon Picker Modal */}
      {showIconPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Choose an Icon</h3>
                <p className="text-xs text-gray-500">Search from {ALL_ICONS.length} available Lucide icons</p>
              </div>
              <button 
                onClick={() => setShowIconPicker(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search icons (e.g. university, grad, star)..."
                  value={iconSearch}
                  onChange={(e) => setIconSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {filteredIcons.map(iconName => (
                <button
                  key={iconName}
                  onClick={() => {
                    setEditingItem({...editingItem!, icon: iconName})
                    setShowIconPicker(false)
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer ${
                    editingItem?.icon === iconName 
                    ? 'border-primary bg-primary/10 text-primary' 
                    : 'border-gray-100 dark:border-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {/* @ts-ignore */}
                  {React.createElement(LucideIcons[iconName], { size: 24 })}
                  <span className="text-[9px] mt-2 font-medium truncate w-full text-center">{iconName}</span>
                </button>
              ))}
              {filteredIcons.length === 0 && (
                <div className="col-span-full py-10 text-center text-gray-500">
                  No icons found matching "{iconSearch}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

