'use client'

import React from 'react'

interface CoreValuesProps {
  title: string
  description: string
  backgroundImageUrl: string
  className?: string
  innerClassName?: string
  isFixed?: boolean
}

const CoreValues = ({
  title,
  description,
  backgroundImageUrl,
  className = '',
  innerClassName = 'max-w-4xl mx-auto px-4 sm:px-8 md:px-16',
  isFixed = true
}: CoreValuesProps) => {
  return (
    <section
      className={`relative w-full py-24 md:py-32 flex items-center justify-center text-center overflow-hidden ${className}`}
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: isFixed ? 'fixed' : 'scroll',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/65"></div>

      {/* Content */}
      <div className={`relative z-10 w-full ${innerClassName}`}>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-8 leading-tight" style={{ color: '#50a2ff' }}>
          {title}
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-white leading-relaxed font-normal max-w-3xl mx-auto">
          {description}
        </p>
      </div>
    </section>
  )
}

export default CoreValues
