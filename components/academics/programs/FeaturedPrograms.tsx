'use client'

import Image from 'next/image'
import Link from 'next/link'
import * as LucideIcons from 'lucide-react'

export interface FeaturedProgramCard {
  id: string
  icon: string
  title: string
  description: string
  duration: string
  requiredStrand: string
  backgroundImage?: string
  isNew?: boolean
  status?: 'available' | 'coming-soon'
}

interface FeaturedProgramsProps {
  title?: string
  subtitle?: string
  cards?: FeaturedProgramCard[]
  cols?: number
}

const DEFAULT_CARDS: FeaturedProgramCard[] = [
  {
    id: '1',
    icon: 'Megaphone',
    title: 'Bachelor of Arts in Communication',
    description:
      'Develop strong communication skills across various media platforms and prepare for careers in journalism, public relations, broadcasting, and digital media.',
    duration: '4 years',
    requiredStrand: 'All Strands',
    backgroundImage: '/1.webp',
    status: 'available',
  },
  {
    id: '2',
    icon: 'Cpu',
    title: 'Bachelor of Science in Information Systems',
    description:
      'Learn to design, implement, and manage information systems that support business operations and decision-making in the digital age.',
    duration: '4 years',
    requiredStrand: 'STEM, TVL-ICT',
    backgroundImage: '/2.webp',
    status: 'available',
  },
  {
    id: '3',
    icon: 'Sigma',
    title: 'Bachelor of Science in Mathematics',
    description:
      'Build a strong foundation in mathematical theory and applications, preparing for careers in education, research, data analysis, and various STEM fields.',
    duration: '4 years',
    requiredStrand: 'STEM, ABM',
    backgroundImage: '/3.webp',
    status: 'available',
  },
  {
    id: '4',
    icon: 'Building2',
    title: 'Bachelor of Public Administration',
    description:
      'Prepare for leadership roles in government and public service, focusing on policy analysis, public management, and civic engagement.',
    duration: '4 years',
    requiredStrand: 'All Strands',
    isNew: true,
    status: 'coming-soon',
  },
  {
    id: '5',
    icon: 'Activity',
    title: 'Bachelor of Physical Education',
    description:
      'Develop expertise in physical fitness, sports science, and health education to become effective physical education teachers and fitness professionals.',
    duration: '4 years',
    requiredStrand: 'All Strands',
    isNew: true,
    status: 'coming-soon',
  },
  {
    id: '6',
    icon: 'Heart',
    title: 'Bachelor of Science in Nursing',
    description:
      'Gain comprehensive knowledge and practical skills in nursing, preparing for a rewarding career in healthcare, patient care, and community health services.',
    duration: '4 years',
    requiredStrand: 'All Strands',
    isNew: true,
    status: 'coming-soon',
  },
]

export default function FeaturedPrograms({
  title = 'Our Featured Programs',
  subtitle = 'Discover academic paths tailored for your success.',
  cards = DEFAULT_CARDS,
  cols = 3,
}: FeaturedProgramsProps) {
  // Filter cards by status - treat undefined status as 'available'
  const activeCards = cards.filter(
    (card) => card.status === 'available' || card.status === undefined
  )
  const comingSoonCards = cards.filter((card) => card.status === 'coming-soon')

  const gridClass = cols === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-16">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-400">
            {subtitle}
          </p>
        </div>

        {/* Featured Programs Grid */}
        <div className={`grid ${gridClass} gap-6 mb-8`}>
          {/* Top Row - Featured Cards with Background Images */}
          {activeCards.map((card) => {
            const IconComponent = (LucideIcons as any)[card.icon] || LucideIcons.GraduationCap

            // If no background image, render like coming-soon card
            if (!card.backgroundImage) {
              return (
                <div
                  key={card.id}
                  className="relative group rounded-xl overflow-hidden h-96 border border-gray-200 dark:border-gray-700"
                >
                  {/* Background */}
                  <div className="absolute inset-0 bg-white dark:bg-gray-900"></div>

                  {/* Content */}
                  <div className="absolute inset-0 p-5 md:p-6 flex flex-col text-gray-900 dark:text-white">
                    {/* Icon - Centered at top */}
                    <div className="flex justify-center mb-4">
                      <IconComponent size={50} className="text-blue-600 dark:text-white" />
                    </div>

                    {/* Title & Description - Center */}
                    <div className="flex-1 flex flex-col justify-center items-start max-w-sm">
                      <h3 className="text-2xl md:text-2xl font-bold mb-2">
                        {card.title}
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-200 mb-4 leading-relaxed">
                        {card.description}
                      </p>

                      {/* Duration & Strand */}
                      <div className="space-y-1 mb-4 text-gray-700 dark:text-gray-200">
                        <p className="text-sm">
                          <span className="font-semibold text-gray-900 dark:text-white">Duration:</span> {card.duration}
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold text-gray-900 dark:text-white">Required Strand:</span>{' '}
                          {card.requiredStrand}
                        </p>
                      </div>
                    </div>

                    {/* Button - Anchored at bottom */}
                    <div className="mt-auto">
                      <Link
                        href={`/programs/course?name=${card.title.split(' ').join('-')}`}
                        className="inline-block bg-primary hover:bg-[#003a7a] text-white px-4 py-1.5 rounded-lg font-medium text-sm transition-colors"
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                </div>
              )
            }

            // Otherwise render with image and overlay
            return (
              <div
                key={card.id}
                className="relative group rounded-xl overflow-hidden h-96 border border-gray-200 dark:border-gray-700"
              >
                {/* Background Image */}
                <Image
                  src={card.backgroundImage}
                  alt={card.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/75 group-hover:bg-black/80 transition-colors"></div>

                {/* Content */}
                <div className="absolute inset-0 p-5 md:p-6 flex flex-col text-white">
                  {/* Icon - Centered at top */}
                  <div className="flex justify-center mb-4">
                    <IconComponent size={50} className="text-white" />
                  </div>

                  {/* Title & Description - Center */}
                  <div className="flex-1 flex flex-col justify-center items-start max-w-sm">
                    <h3 className="text-2xl md:text-2xl font-bold mb-2">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-200 mb-4 leading-relaxed">
                      {card.description}
                    </p>

                    {/* Duration & Strand */}
                    <div className="space-y-1 mb-4">
                      <p className="text-sm">
                        <span className="font-semibold">Duration:</span> {card.duration}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Required Strand:</span>{' '}
                        {card.requiredStrand}
                      </p>
                    </div>
                  </div>

                  {/* Button - Anchored at bottom */}
                  <div className="mt-auto">
                    <Link
                      href={`/programs/course?name=${card.title.split(' ').join('-')}`}
                      className="inline-block bg-primary hover:bg-[#003a7a] text-white px-4 py-1.5 rounded-lg font-medium text-sm transition-colors"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom Row - Additional Programs */}
        <div className={`grid ${gridClass} gap-6`}>
          {comingSoonCards.map((card) => {
            const IconComponent = (LucideIcons as any)[card.icon] || LucideIcons.GraduationCap

            return (
              <div
                key={card.id}
                className="relative group rounded-xl overflow-hidden h-96 border border-gray-200 dark:border-gray-700"
              >
                {/* Background */}
                <div className="absolute inset-0 bg-white dark:bg-gray-900"></div>

                {/* New Badge */}
                {card.isNew && (
                  <div className="absolute top-3 right-3 bg-red-600 text-white px-2.5 py-1 rounded-full text-xs font-bold z-10">
                    New
                  </div>
                )}

                {/* Content */}
                <div className="absolute inset-0 p-5 md:p-6 flex flex-col text-gray-900 dark:text-white">
                  {/* Icon - Centered at top */}
                  <div className="flex justify-center mb-4">
                    <IconComponent size={50} className="text-blue-600 dark:text-white" />
                  </div>

                  {/* Title & Description - Center */}
                  <div className="flex-1 flex flex-col justify-center items-start max-w-sm">
                    <h3 className="text-2xl md:text-2xl font-bold mb-2">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-200 mb-4 leading-relaxed">
                      {card.description}
                    </p>

                    {/* Duration & Strand */}
                    <div className="space-y-1 mb-4 text-gray-700 dark:text-gray-200">
                      <p className="text-sm">
                        <span className="font-semibold text-gray-900 dark:text-white">Duration:</span> {card.duration}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold text-gray-900 dark:text-white">Required Strand:</span>{' '}
                        {card.requiredStrand}
                      </p>
                    </div>
                  </div>

                  {/* Button - Anchored at bottom */}
                  <div className="mt-auto">
                    <button
                      disabled
                      className="inline-block bg-gray-500 text-white px-4 py-1.5 rounded-lg font-medium text-sm cursor-not-allowed opacity-60"
                    >
                      Coming Soon
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
