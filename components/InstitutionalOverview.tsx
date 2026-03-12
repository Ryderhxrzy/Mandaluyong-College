'use client'

import * as LucideIcons from 'lucide-react'

export interface OverviewItem {
  id: string
  icon: string
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
    // @ts-ignore
    const IconComponent = LucideIcons[iconName] || LucideIcons.Users
    return <IconComponent size={size} />
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
              className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 text-center flex flex-col items-center justify-center min-h-[160px] h-full"
            >
              <div 
                className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 shrink-0 transition bg-[var(--bg-light)] dark:bg-[var(--bg-dark)]"
                style={{ 
                  // @ts-ignore
                  '--bg-light': item.bgColorLight,
                  '--bg-dark': item.bgColorDark,
                }}
              >
                <span style={{ color: item.color }}>{getIcon(item.icon, 24)}</span>
              </div>
              <div 
                className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 break-words w-full"
                style={{ color: item.color }}
              >
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
