'use client'

import Link from 'next/link'
import * as LucideIcons from 'lucide-react'

export interface WhyChooseCard {
  id: string
  icon: string
  title: string
  description: string
  iconColor?: string
  bgColorLight?: string
  bgColorDark?: string
}

interface AboutWhyChooseProps {
  title?: string
  subtitle?: string
  cards?: WhyChooseCard[]
  forceTwoColumn?: boolean
}

const DEFAULT_CARDS: WhyChooseCard[] = [
  {
    id: '1',
    icon: 'BookOpen',
    title: 'Quality Education',
    description: 'Comprehensive programs designed to prepare students for success.',
    iconColor: '#003a7a',
    bgColorLight: '#ebf2fa',
  },
  {
    id: '2',
    icon: 'Lightbulb',
    title: 'Innovation & Research',
    description: 'Dynamic research culture driving continuous improvement.',
    iconColor: '#003a7a',
    bgColorLight: '#ebf2fa',
  },
  {
    id: '3',
    icon: 'Users',
    title: 'Supportive Community',
    description: 'A caring environment where everyone is empowered to thrive.',
    iconColor: '#003a7a',
    bgColorLight: '#ebf2fa',
  },
  {
    id: '4',
    icon: 'Award',
    title: 'Excellence & Service',
    description: 'Guided by values of integrity, nationalism, and public service.',
    iconColor: '#003a7a',
    bgColorLight: '#ebf2fa',
  },
]

export default function AboutWhyChoose({
  title = 'Why Choose Mandaluyong College of Science and Technology?',
  subtitle = 'Discover what sets MCST apart. We are dedicated to providing transformative education, fostering innovation, and building a community committed to public service and excellence.',
  cards = DEFAULT_CARDS,
  forceTwoColumn = false,
}: AboutWhyChooseProps) {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-400 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Four Cards Grid */}
        <div className={`grid gap-8 mb-12 ${forceTwoColumn ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
          {cards.map((card) => {
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

        {/* CTA Button */}
        <div className="text-center">
          <Link
            href="/admissions"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-[#003a7a] transition"
          >
            Apply Now <LucideIcons.ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  )
}
