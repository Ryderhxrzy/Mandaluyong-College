'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface CTAProps {
  title: string
  description: string
  buttonText?: string
  buttonLink?: string
  className?: string
  asPreview?: boolean
}

const CTA = ({
  title,
  description,
  buttonText = 'Apply Now',
  buttonLink = '/admissions',
  className = '',
  asPreview = false
}: CTAProps) => {
  return (
    <section className={`bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 py-16 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-[1400px] mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white leading-tight">
          {title}
        </h2>
        <p className="text-sm sm:text-base md:text-xl mb-8 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
        <div className="flex justify-center">
          {asPreview ? (
            <div className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-medium shadow-md cursor-pointer">
              {buttonText} <ArrowRight size={20} />
            </div>
          ) : (
            <Link
              href={buttonLink}
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-[#003a7a] transition shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              {buttonText} <ArrowRight size={20} />
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

export default CTA
