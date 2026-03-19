import Image from 'next/image'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface AdmissionsImage {
  id: string
  image: string
  altText: string
}

interface AdmissionsCTAProps {
  title?: string
  description?: string
  images?: AdmissionsImage[]
  dynamic?: boolean
}

const DEFAULT_IMAGES: AdmissionsImage[] = [
  { id: '1', image: '/2.webp', altText: 'MCST Students' },
  { id: '2', image: '/3.webp', altText: 'MCST Community' },
  { id: '3', image: '/5.jpg', altText: 'MCST Students Group' },
  { id: '4', image: '/6.jpg', altText: 'MCST Excellence' },
]

export default function AdmissionsCTA({
  title = 'MCST Mandaluyong College of Science and Technology',
  description = 'Begin your journey with an institution dedicated to excellence in science, innovation, and inclusive education. At MCST, we nurture future-ready leaders and critical thinkers committed to national development and global competitiveness.',
  images = DEFAULT_IMAGES,
  dynamic = false,
}: AdmissionsCTAProps) {
  const [ctaData, setCtaData] = useState({ title, description, images })
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    if (dynamic) {
      fetchCTAData()
    }
  }, [dynamic])

  useEffect(() => {
    if (!isMounted || !dynamic) return

    // Set up real-time subscriptions
    const ctaChannel = supabase
      .channel('admissions_cta_realtime_standalone')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admissions_cta' }, () => {
        fetchCTAData()
      })
      .subscribe()

    const ctaImagesChannel = supabase
      .channel('admissions_cta_images_realtime_standalone')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admissions_cta_images' }, () => {
        fetchCTAData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(ctaChannel)
      supabase.removeChannel(ctaImagesChannel)
    }
  }, [isMounted, dynamic])

  const fetchCTAData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admissions/cta')
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setCtaData({
            title: data.title || title,
            description: data.description || description,
            images: data.images && data.images.length > 0 
              ? data.images.map((img: any) => ({
                  id: String(img.id),
                  image: img.image_url,
                  altText: img.alt_text
                }))
              : images
          })
        }
      }
    } catch (error) {
      console.error('Error fetching CTA data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && dynamic) {
    return (
      <section className="py-12 sm:py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-8"></div>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 bg-gray-300 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
        {/* Desktop Layout: Content Left, Images Right */}
        <div className="hidden lg:grid grid-cols-2 gap-12 items-center">
          {/* Left Side: Title and Description */}
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
              {ctaData.title}
            </h2>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-400">
              {ctaData.description}
            </p>
          </div>

          {/* Right Side: Images Grid - 2 Per Row */}
          <div className="grid grid-cols-2 gap-3 h-fit sticky top-32">
            {ctaData.images.map((img) => (
              <div key={img.id} className="w-full rounded-lg overflow-hidden shadow-lg">
                {img.image ? (
                  <Image src={img.image} alt={img.altText} width={300} height={250} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-72 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile/Tablet Layout: Images at Top, Content at Bottom */}
        <div className="lg:hidden space-y-8">
          {/* Images Grid - 2 Per Row on Tablet, 1 on Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3">
            {ctaData.images.map((img) => (
              <div key={img.id} className="w-full rounded-lg overflow-hidden shadow-lg">
                {img.image ? (
                  <Image src={img.image} alt={img.altText} width={300} height={250} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-56 sm:h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Title and Description */}
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
              {ctaData.title}
            </h2>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-400">
              {ctaData.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
