'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Trash2, Edit2, Plus, Upload } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import toast from 'react-hot-toast'
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from 'next-cloudinary'
import ContactInfoSection from '@/components/contact/ContactInfoSection'
import IconPicker from '@/components/admin/IconPicker'

interface ContactItem {
  id: string
  type: string
  label: string
  content: string
}

interface InfoData {
  id: string | null
  section_image: string
  items: ContactItem[]
}

interface EditingItem extends Omit<ContactItem, 'id'> {
  id?: string
}

const renderIcon = (iconName: string) => {
  try {
    // @ts-expect-error - Dynamic icon access
    const IconComponent = LucideIcons[iconName]
    if (IconComponent) {
      return <IconComponent size={18} className="text-primary" />
    }
  } catch {
    // Fallback
  }
  return <LucideIcons.MapPin size={18} className="text-primary" />
}

export default function ContactInfoAdmin() {
  const [loading, setLoading] = useState(true)
  const [infoData, setInfoData] = useState<InfoData>({
    id: null,
    section_image: '/join2.jpg',
    items: [],
  })

  const [editingHeader, setEditingHeader] = useState(false)
  const [headerData, setHeaderData] = useState<Omit<InfoData, 'items'>>(
    { id: null, section_image: '/join2.jpg' }
  )
  const [isSavingHeader, setIsSavingHeader] = useState(false)

  const [editingItem, setEditingItem] = useState<EditingItem | null>(null)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [isSavingItem, setIsSavingItem] = useState(false)
  const [isDeletingItem, setIsDeletingItem] = useState<string | null>(null)
  const [showIconPicker, setShowIconPicker] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const infoRes = await fetch('/api/admin/contact/info')

      if (infoRes.ok) {
        const info = await infoRes.json()
        setInfoData(info)
        setHeaderData({ id: info.id, section_image: info.section_image })
      }
    } catch (error) {
      console.error('Error fetching contact data:', error)
      toast.error('Failed to load contact data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const getPreviewItems = useCallback((): ContactItem[] => {
    if (!editingItem) return infoData.items

    const items = [...infoData.items]
    if (editingItemId) {
      const idx = items.findIndex((item) => item.id === editingItemId)
      if (idx >= 0) {
        items[idx] = { ...editingItem, id: editingItemId } as ContactItem
      }
    } else {
      items.push({
        id: `new-${Date.now()}`,
        ...editingItem,
      } as ContactItem)
    }
    return items
  }, [editingItem, editingItemId, infoData.items])

  const handleSaveHeader = async () => {
    setIsSavingHeader(true)
    try {
      const response = await fetch('/api/admin/contact/info/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section_image: headerData.section_image,
        }),
      })

      if (!response.ok) throw new Error('Failed to save info')

      const updated = await response.json()
      setInfoData((prev) => ({ ...prev, ...updated }))
      setHeaderData({ id: updated.id, section_image: updated.section_image })
      setEditingHeader(false)
      toast.success('Info section updated successfully!')
    } catch (error) {
      console.error('Error saving info:', error)
      toast.error('Failed to save info section')
    } finally {
      setIsSavingHeader(false)
    }
  }

  const handleImageUpload = (results: CloudinaryUploadWidgetResults) => {
    if (
      results.event === 'success' &&
      results.info &&
      typeof results.info === 'object' &&
      'secure_url' in results.info
    ) {
      const imageUrl = (results.info as { secure_url: string }).secure_url
      setHeaderData({ ...headerData, section_image: imageUrl })
      toast.success('Image uploaded successfully!')
    }
  }

  const handleSaveItem = async () => {
    if (!editingItem?.type.trim() || !editingItem?.label.trim() || !editingItem?.content.trim()) {
      toast.error('All fields are required')
      return
    }

    setIsSavingItem(true)
    try {
      const itemsToSave = editingItemId
        ? infoData.items.map((item) =>
            item.id === editingItemId ? { ...editingItem, id: editingItemId } : item
          )
        : [...infoData.items, editingItem]

      const response = await fetch('/api/admin/contact/info/items/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsToSave }),
      })

      if (!response.ok) throw new Error('Failed to save item')

      const saved = await response.json()
      setInfoData((prev) => ({ ...prev, items: saved }))
      setEditingItem(null)
      setEditingItemId(null)
      toast.success(editingItemId ? 'Item updated successfully!' : 'Item added successfully!')
    } catch (error) {
      console.error('Error saving item:', error)
      toast.error('Failed to save item')
    } finally {
      setIsSavingItem(false)
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Delete this item?')) return

    setIsDeletingItem(id)
    try {
      const response = await fetch(`/api/admin/contact/info/items?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete item')

      setInfoData((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.id !== id),
      }))
      toast.success('Item deleted successfully!')
    } catch (error) {
      console.error('Error deleting item:', error)
      toast.error('Failed to delete item')
    } finally {
      setIsDeletingItem(null)
    }
  }

  if (loading) {
    return (
      <div className="p-6 w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Contact - Info Section
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
        Contact - Info Section
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {editingItem ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Edit Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Icon
                </label>
                <button
                  type="button"
                  onClick={() => setShowIconPicker(true)}
                  className="w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:border-primary hover:bg-primary/5 transition flex items-center justify-center gap-2"
                >
                  {editingItem.type ? (
                    <>
                      <span className="text-sm">{editingItem.type}</span>
                      <span className="text-xs text-gray-500">Selected</span>
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      <span className="text-sm">Choose an Icon</span>
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Select an icon from the Lucide icon library. The icon name will be saved.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Label
                </label>
                <input
                  type="text"
                  value={editingItem.label}
                  onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })}
                  placeholder="e.g., Main Campus"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Content
                </label>
                <textarea
                  value={editingItem.content}
                  onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                  placeholder="Enter content..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setEditingItem(null)
                    setEditingItemId(null)
                  }}
                  className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveItem}
                  disabled={isSavingItem}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSavingItem ? 'Saving...' : 'Save Item'}
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
                <ContactInfoSection
                  items={getPreviewItems()}
                  sectionImage={editingHeader ? headerData.section_image : infoData.section_image}
                />
              </div>
            </div>

            {showIconPicker && editingItem && (
              <IconPicker
                selectedIcon={editingItem.type}
                onSelect={(iconName) => {
                  setEditingItem({ ...editingItem, type: iconName })
                  setShowIconPicker(false)
                }}
                onClose={() => setShowIconPicker(false)}
              />
            )}
          </div>
        ) : (
          <div className="p-6 space-y-8">
            {/* Header Section */}
            {editingHeader ? (
              <div className="space-y-4 p-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Edit Section Image
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Section Image URL
                    </label>
                    <input
                      type="text"
                      value={headerData.section_image}
                      readOnly
                      placeholder="Image URL will appear here after upload"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white cursor-not-allowed opacity-60"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      This field is read-only. Use the upload button below to change the image.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Upload Section Image
                    </label>
                    <CldUploadWidget
                      onSuccess={handleImageUpload}
                      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                    >
                      {({ open }) => (
                        <button
                          onClick={() => open()}
                          className="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#003a7a] transition cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Upload size={18} /> Upload New Image
                        </button>
                      )}
                    </CldUploadWidget>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-blue-200 dark:border-blue-800">
                  <button
                    onClick={() => {
                      setEditingHeader(false)
                      setHeaderData({
                        id: infoData.id,
                        section_image: infoData.section_image,
                      })
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
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Section Image
                  </p>
                  {infoData.section_image && (
                    <div className="mt-2 relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                      <Image
                        src={infoData.section_image}
                        alt="Section"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setEditingHeader(true)}
                    className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-[#003a7a] transition cursor-pointer"
                  >
                    Edit Image
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
                <ContactInfoSection
                  items={infoData.items}
                  sectionImage={infoData.section_image}
                />
              </div>
            </div>

            {/* Manage Items Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Manage Contact Items
                </h2>
                <button
                  onClick={() => {
                    setEditingItem({ type: '', label: '', content: '' })
                    setEditingItemId(null)
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-[#003a7a] transition cursor-pointer flex items-center gap-2"
                >
                  <Plus size={16} /> Add Item
                </button>
              </div>
              <div className="space-y-3">
                {infoData.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/70 transition"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="flex-shrink-0">
                          {renderIcon(item.type)}
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 block">{item.type}</span>
                          <span className="text-gray-900 dark:text-white font-medium">{item.label}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 ml-[34px]">{item.content}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => {
                          setEditingItem(item)
                          setEditingItemId(item.id)
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded cursor-pointer transition"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        disabled={isDeletingItem === item.id}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded cursor-pointer transition disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {infoData.items.length === 0 && (
                  <p className="text-center py-8 text-gray-500 italic text-sm">
                    No contact items found. Create your first item!
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
