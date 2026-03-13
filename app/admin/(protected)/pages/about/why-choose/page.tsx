'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import toast from 'react-hot-toast'
import { HexColorPicker } from 'react-colorful'
import AboutWhyChoose, { WhyChooseCard } from '@/components/about/AboutWhyChoose'
import ColorPalettePicker, { ColorPalette } from '@/components/admin/ColorPalettePicker'
import IconPicker from '@/components/admin/IconPicker'

interface DBWhyChooseCard {
  id: number
  why_choose_id: number
  icon: string
  title: string
  description: string
  icon_color: string
  icon_bg_color_light: string
  icon_bg_color_dark: string
  order: number
  created_at: string
}

interface DBWhyChooseSection {
  id: number
  title: string
  subtitle: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function AboutWhyChoosePage() {
  const [section, setSection] = useState<DBWhyChooseSection | null>(null)
  const [cards, setCards] = useState<DBWhyChooseCard[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingCard, setEditingCard] = useState<Partial<DBWhyChooseCard> | null>(null)
  const [title, setTitle] = useState('Why Choose Mandaluyong College of Science and Technology?')
  const [subtitle, setSubtitle] = useState('Discover what sets MCST apart. We are dedicated to providing transformative education, fostering innovation, and building a community committed to public service and excellence.')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showIconPicker, setShowIconPicker] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

      // Fetch section data
      const sectionResponse = await fetch(`${apiUrl}/api/admin/about/why-choose`)
      if (sectionResponse.ok) {
        const sectionData = await sectionResponse.json()
        if (sectionData?.id) {
          setSection(sectionData)
          setTitle(sectionData.title || title)
          setSubtitle(sectionData.subtitle || subtitle)
        }
      }

      // Fetch cards
      const cardsResponse = await fetch(`${apiUrl}/api/admin/about/why-choose/cards`)
      if (cardsResponse.ok) {
        const cardsData = await cardsResponse.json()
        setCards(Array.isArray(cardsData) ? cardsData : [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateHeader = async () => {
    if (!title.trim() || !subtitle.trim()) {
      toast.error('Title and Subtitle are required')
      return
    }

    setIsSaving(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/about/why-choose/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, subtitle })
      })

      if (response.ok) {
        toast.success('Section header updated!')
        fetchData()
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
    if (editingCard) {
      setEditingCard({
        ...editingCard,
        icon_color: palette.color,
        icon_bg_color_light: palette.bgLight,
        icon_bg_color_dark: palette.bgDark
      })
      toast.success(`${palette.name} palette applied!`)
    }
  }

  const handleAddCard = () => {
    setEditingCard({
      id: undefined,
      why_choose_id: section?.id || 0,
      icon: 'BookOpen',
      title: '',
      description: '',
      icon_color: '#003a7a',
      icon_bg_color_light: '#ebf2fa',
      icon_bg_color_dark: '#1e293b',
      order: cards.length + 1,
      created_at: new Date().toISOString()
    })
    setIsEditing(true)
  }

  const handleEditCard = (card: DBWhyChooseCard) => {
    setEditingCard(card)
    setIsEditing(true)
  }

  const handleDeleteCard = async (id: number) => {
    if (!confirm('Are you sure you want to delete this card?')) return

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/about/why-choose/cards`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })

      if (response.ok) {
        setCards(cards.filter(card => card.id !== id))
        toast.success('Card deleted successfully!')
      } else {
        toast.error('Failed to delete card')
      }
    } catch (error) {
      console.error('Error deleting card:', error)
      toast.error('An error occurred while deleting')
    }
  }

  const handleSaveCard = async () => {
    if (!editingCard?.title || !editingCard?.description || !editingCard?.icon) {
      toast.error('Title, Description, and Icon are required')
      return
    }

    setIsSaving(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/about/why-choose/cards/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCard)
      })

      const result = await response.json()
      if (response.ok) {
        if (editingCard.id) {
          setCards(cards.map(card => card.id === result.data.id ? result.data : card))
        } else {
          setCards([...cards, result.data])
        }
        toast.success('Card saved successfully!')
        setIsEditing(false)
        setEditingCard(null)
      } else {
        toast.error(result.error || 'Failed to save card')
      }
    } catch (error) {
      console.error('Error saving card:', error)
      toast.error('An error occurred while saving')
    } finally {
      setIsSaving(false)
    }
  }

  const mapToPreviewCards = (dbCards: DBWhyChooseCard[]): WhyChooseCard[] => {
    return dbCards.map(card => ({
      id: String(card.id),
      icon: card.icon,
      title: card.title,
      description: card.description,
      iconColor: card.icon_color,
      bgColorLight: card.icon_bg_color_light,
      bgColorDark: card.icon_bg_color_dark,
    }))
  }

  const getPreviewCards = (): DBWhyChooseCard[] => {
    if (!editingCard) return cards
    if (editingCard.id) {
      return cards.map(card => card.id === editingCard.id ? (editingCard as DBWhyChooseCard) : card)
    }
    return [...cards, editingCard as DBWhyChooseCard]
  }

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Why Choose MCST
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {isEditing && editingCard ? (
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
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Section Title"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <textarea
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
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
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Card Title</label>
                <input
                  type="text"
                  value={editingCard.title || ''}
                  onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                  placeholder="e.g., Quality Education"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Card Description</label>
                <textarea
                  value={editingCard.description || ''}
                  onChange={(e) => setEditingCard({ ...editingCard, description: e.target.value })}
                  rows={3}
                  placeholder="Card description text"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Icon</label>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    {editingCard.icon && (LucideIcons as any)[editingCard.icon] ? (
                      React.createElement((LucideIcons as any)[editingCard.icon], { size: 24 })
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
                    color={editingCard.icon_color}
                    onChange={(color) => setEditingCard({ ...editingCard, icon_color: color })}
                  />
                  <input
                    type="text"
                    value={editingCard.icon_color}
                    onChange={(e) => setEditingCard({ ...editingCard, icon_color: e.target.value })}
                    className="w-full mt-2 px-2 py-1 text-xs border border-gray-300 rounded uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">BG Light</label>
                  <HexColorPicker
                    color={editingCard.icon_bg_color_light}
                    onChange={(color) => setEditingCard({ ...editingCard, icon_bg_color_light: color })}
                  />
                  <input
                    type="text"
                    value={editingCard.icon_bg_color_light}
                    onChange={(e) => setEditingCard({ ...editingCard, icon_bg_color_light: e.target.value })}
                    className="w-full mt-2 px-2 py-1 text-xs border border-gray-300 rounded uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">BG Dark</label>
                  <HexColorPicker
                    color={editingCard.icon_bg_color_dark}
                    onChange={(color) => setEditingCard({ ...editingCard, icon_bg_color_dark: color })}
                  />
                  <input
                    type="text"
                    value={editingCard.icon_bg_color_dark}
                    onChange={(e) => setEditingCard({ ...editingCard, icon_bg_color_dark: e.target.value })}
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
                  onClick={handleSaveCard}
                  disabled={isSaving}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-medium cursor-pointer"
                >
                  {isSaving ? 'Saving...' : 'Save Card'}
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
                <div className="p-8">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                      {title}
                    </h2>
                    <p className="text-lg text-gray-700 dark:text-gray-400 max-w-3xl mx-auto">
                      {subtitle}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {mapToPreviewCards(getPreviewCards()).map((card) => {
                      const IconComponent = (LucideIcons as any)[card.icon] || LucideIcons.HelpCircle
                      return (
                        <div
                          key={card.id}
                          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 rounded-lg text-left transition"
                        >
                          <div
                            className="flex items-center justify-center w-16 h-16 rounded-full mb-4"
                            style={{
                              backgroundColor: card.bgColorLight || '#ebf2fa',
                            }}
                          >
                            <IconComponent
                              size={40}
                              style={{ color: card.iconColor || '#003a7a' }}
                            />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                            {card.title}
                          </h3>
                          <p className="text-gray-700 dark:text-gray-400">
                            {card.description}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
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
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Current Layout</h2>
                <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                <AboutWhyChoose title={title} subtitle={subtitle} cards={mapToPreviewCards(cards.filter(c => cards.indexOf(c) >= 0))} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Manage Cards</h2>
                <button
                  onClick={handleAddCard}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-[#003a7a] transition cursor-pointer flex items-center gap-2"
                >
                  <Plus size={16} /> Add New Card
                </button>
              </div>
              <div className="space-y-3">
                {cards.map((card) => (
                  <div key={card.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
                        style={{ backgroundColor: card.icon_bg_color_light }}
                      >
                        {(LucideIcons as any)[card.icon] ? React.createElement((LucideIcons as any)[card.icon], { size: 20, color: card.icon_color }) : <LucideIcons.HelpCircle size={20} />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{card.title}</p>
                        <p className="text-xs text-gray-500 truncate max-w-md">{card.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditCard(card)}
                        className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCard(card.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                {cards.length === 0 && (
                  <p className="text-center py-10 text-gray-500 italic">No cards found. Create your first card!</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {showIconPicker && editingCard && (
        <IconPicker
          selectedIcon={editingCard.icon || ''}
          onSelect={(iconName) => {
            setEditingCard({ ...editingCard, icon: iconName })
            setShowIconPicker(false)
          }}
          onClose={() => setShowIconPicker(false)}
        />
      )}
    </div>
  )
}
