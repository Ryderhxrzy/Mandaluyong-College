'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

interface Program {
  id: number
  title: string
  image: string | null
  order: number
  is_active: boolean
}

const ProgramsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const [slides, setSlides] = useState<Program[]>([])

  const DEFAULT_SLIDES: Program[] = [
    {
      id: 1,
      title: 'Administration',
      image: '/administration.jpg',
      order: 1,
      is_active: true,
    },
    {
      id: 2,
      title: 'Nursing',
      image: '/nursing.webp',
      order: 2,
      is_active: true,
    },
    {
      id: 3,
      title: 'Physical Education',
      image: '/pe.jpg',
      order: 3,
      is_active: true,
    },
  ]

  useEffect(() => {
    fetchPrograms()
  }, [])

  const fetchPrograms = async () => {
    try {
      const response = await fetch('/api/admin/home/academic-programs', {
        cache: 'no-store',
      })
      if (response.ok) {
        const data = await response.json()
        const activeSlides = (data || []).filter((p: Program) => p.is_active && p.image)
        setSlides(activeSlides.length > 0 ? activeSlides : DEFAULT_SLIDES)
      } else {
        setSlides(DEFAULT_SLIDES)
      }
    } catch (error) {
      console.error('Error fetching programs:', error)
      setSlides(DEFAULT_SLIDES)
    }
  }

  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoPlay, slides.length])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
    setAutoPlay(false)
    setTimeout(() => setAutoPlay(true), 10000)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
    setAutoPlay(false)
    setTimeout(() => setAutoPlay(true), 10000)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setAutoPlay(false)
    setTimeout(() => setAutoPlay(true), 10000)
  }

  return (
    <section className="w-full py-12">
      {/* Title */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          Our Programs
        </h2>
      </div>

      {/* Carousel Container */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative w-full h-96 overflow-hidden rounded-lg bg-black">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {slide.image && (
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
            )}
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        ))}

        {/* Previous Button */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 text-white p-1.5 sm:p-2 rounded-full transition cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Next Button */}
        <button
          onClick={goToNext}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 text-white p-1.5 sm:p-2 rounded-full transition cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight size={18} />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition cursor-pointer ${
                index === currentIndex
                  ? 'bg-white'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        </div>
      </div>
    </section>
  )
}

export default ProgramsCarousel
