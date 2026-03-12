'use client'

import React, { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

export interface ColorPalette {
  name: string
  color: string
  bgLight: string
  bgDark: string
}

export const COLOR_PALETTES: ColorPalette[] = [
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

interface ColorPalettePickerProps {
  onSelect: (palette: ColorPalette) => void
  label?: string
}

const ColorPalettePicker = ({ onSelect, label = 'Quick Color Palettes' }: ColorPalettePickerProps) => {
  const [showAllPalettes, setShowAllPalettes] = useState(false)

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{label}</label>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3 transition-all duration-300">
        {(showAllPalettes ? COLOR_PALETTES : COLOR_PALETTES.slice(0, 6)).map((palette) => (
          <button
            key={palette.name}
            type="button"
            onClick={() => onSelect(palette)}
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
        type="button"
        onClick={() => setShowAllPalettes(!showAllPalettes)}
        className="w-full py-2 flex items-center justify-center gap-1 text-primary text-xs font-semibold border border-dashed border-gray-200 dark:border-gray-700 rounded-lg hover:bg-primary/5 transition cursor-pointer"
      >
        {showAllPalettes ? 'Show Less' : 'Show All Colors'}
        {showAllPalettes ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
    </div>
  )
}

export default ColorPalettePicker
