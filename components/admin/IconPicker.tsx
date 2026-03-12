'use client'

import React, { useState } from 'react'
import * as LucideIcons from 'lucide-react'
import { Search, X } from 'lucide-react'

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

interface IconPickerProps {
  selectedIcon: string
  onSelect: (iconName: string) => void
  onClose: () => void
}

const IconPicker = ({ selectedIcon, onSelect, onClose }: IconPickerProps) => {
  const [iconSearch, setIconSearch] = useState('')

  const filteredIcons = ALL_ICONS.filter(name => 
    name.toLowerCase().includes((iconSearch || '').toLowerCase())
  ).slice(0, 300)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Choose an Icon</h3>
            <p className="text-xs text-gray-500">Search from {ALL_ICONS.length} available Lucide icons</p>
          </div>
          <button 
            type="button"
            onClick={onClose}
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
              type="button"
              onClick={() => onSelect(iconName)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer ${
                selectedIcon === iconName 
                ? 'border-primary bg-primary/10 text-primary' 
                : 'border-gray-100 dark:border-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {/* @ts-ignore */}
              {React.createElement(LucideIcons[iconName] || LucideIcons.HelpCircle, { size: 24 })}
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
  )
}

export default IconPicker
