'use client'

import React from 'react'
import * as LucideIcons from 'lucide-react'

export interface CommitmentItem {
  id: string
  title: string
  description: string
  icon: string
  iconColor?: string
  bgColorLight?: string
  bgColorDark?: string
  iconTitle: string
}

interface EducationCommitmentProps {
  title: string
  subtitle: string
  items: CommitmentItem[]
  forceSingleColumn?: boolean
}

const EducationCommitment = ({ title, subtitle, items, forceSingleColumn }: EducationCommitmentProps) => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      <div className="w-full px-4 sm:px-8 md:px-16 max-w-[1400px] mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            {title}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className={forceSingleColumn ? "grid grid-cols-1 gap-6" : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8"}>
          {items.map((item) => {
            const IconComponent = (LucideIcons as any)[item.icon] || LucideIcons.HelpCircle

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 text-center transition"
              >
                <div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                  style={{
                    backgroundColor: item.bgColorLight || '#ebf2fa',
                    // Note: dark mode background color is harder to set inline without a full theme system
                    // or CSS variables, but we can use Tailwind classes for the default and style for the light/dark manual override
                  }}
                >
                  <IconComponent
                    size={32}
                    style={{ color: item.iconColor || '#003a7a' }}
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {item.iconTitle}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default EducationCommitment
