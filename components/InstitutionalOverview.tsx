'use client'

import { Users, Award, BookOpen, Target } from 'lucide-react'

export interface OverviewItem {
  id: string
  icon: 'Users' | 'Award' | 'BookOpen' | 'Target'
  value: string
  label: string
  color: string
  bgColorLight: string
  bgColorDark: string
}

interface InstitutionalOverviewProps {
  title: string
  items: OverviewItem[]
  className?: string
  containerClassName?: string
  columns?: 1 | 2 | 4
}

export default function InstitutionalOverview({ 
  title, 
  items, 
  className = "", 
  containerClassName = "",
  columns = 4
}: InstitutionalOverviewProps) {
  const getIcon = (iconName: string, size = 20) => {
    switch (iconName) {
      case 'Users': return <Users size={size} />
      case 'Award': return <Award size={size} />
      case 'BookOpen': return <BookOpen size={size} />
      case 'Target': return <Target size={size} />
      default: return <Users size={size} />
    }
  }

  const gridCols = columns === 1 
    ? 'grid-cols-1' 
    : columns === 2 
      ? 'grid-cols-1 sm:grid-cols-2' 
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'

  return (
    <section className={`py-10 md:py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 ${className}`}>
      <div className={`w-full px-4 sm:px-6 md:px-8 lg:px-16 max-w-[1400px] mx-auto ${containerClassName}`}>
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 break-words">
            {title}
          </h2>
        </div>
        <div className={`grid ${gridCols} gap-3 md:gap-4 lg:gap-6 items-stretch`}>
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 transition duration-300 text-center hover:shadow-md dark:hover:shadow-primary/5 flex flex-col items-center justify-center min-h-[160px] h-full"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 ${item.bgColorLight} ${item.bgColorDark} rounded-full mb-3 shrink-0 transition`}>
                <span className={item.color}>{getIcon(item.icon, 24)}</span>
              </div>
              <div className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${item.color} mb-1 break-words w-full`}>
                {item.value}
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-semibold uppercase tracking-wide break-words w-full leading-relaxed">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
