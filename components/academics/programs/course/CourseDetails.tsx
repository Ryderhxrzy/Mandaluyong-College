'use client'

import Link from 'next/link'
import * as LucideIcons from 'lucide-react'
import { ArrowLeft } from 'lucide-react'

export interface CourseDetailsProps {
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

export default function CourseDetails({ program }: { program: CourseDetailsProps }) {
  const IconComponent = (LucideIcons as any)[program.icon] || LucideIcons.GraduationCap
  const isComingSoon = program.status === 'coming-soon'

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12 md:py-16">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-16">
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Programs
          </Link>
          <div className="flex items-start gap-6 mb-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white/20">
              <IconComponent size={40} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {program.title}
              </h1>
              {program.isNew && (
                <span className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  New Program
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-16 py-16 md:py-24">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                About This Program
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {program.description}
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Program Details
              </h2>
              <div className="space-y-6">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Duration
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">{program.duration}</p>
                </div>
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Required Strand
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">{program.requiredStrand}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Status
                  </h3>
                  <div className="inline-block">
                    {isComingSoon ? (
                      <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-lg font-medium">
                        Coming Soon
                      </span>
                    ) : (
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-4 py-2 rounded-lg font-medium">
                        Currently Available
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Key Information */}
            <div className="bg-blue-50 dark:bg-gray-800/50 border border-blue-200 dark:border-gray-700 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                What You'll Learn
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold mt-1">✓</span>
                  <span>Advanced knowledge and practical skills in your field of study</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold mt-1">✓</span>
                  <span>Research and innovation capabilities</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold mt-1">✓</span>
                  <span>Professional and leadership development</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold mt-1">✓</span>
                  <span>Real-world application through internships and projects</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-20 bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Interested?
              </h3>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Duration
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {program.duration}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Required Strand
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {program.requiredStrand}
                  </p>
                </div>
              </div>

              {isComingSoon ? (
                <button
                  disabled
                  className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg font-medium cursor-not-allowed opacity-60 mb-4"
                >
                  Coming Soon
                </button>
              ) : (
                <Link
                  href="/admissions"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium text-center transition-colors mb-4"
                >
                  Apply Now
                </Link>
              )}

              <Link
                href="/programs"
                className="block w-full text-center border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                View Other Programs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
