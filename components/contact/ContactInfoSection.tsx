import React from 'react'
import Image from 'next/image'
import * as LucideIcons from 'lucide-react'
import ApplyLocationMap from '@/components/apply/ApplyLocationMap'

export interface ContactItem {
  id: string
  type: string
  label: string
  content: string
}

export interface ContactInfoSectionProps {
  items?: ContactItem[]
  sectionImage?: string
}

export default function ContactInfoSection({
  items = [],
  sectionImage = '/join2.jpg',
}: ContactInfoSectionProps) {
  const getIcon = (iconName: string) => {
    try {
      // @ts-ignore
      const IconComponent = LucideIcons[iconName]
      if (IconComponent) {
        return <IconComponent className="text-primary" size={24} />
      }
    } catch (e) {
      // Fallback to MapPin if icon not found
    }
    // @ts-ignore
    return <LucideIcons.MapPin className="text-primary" size={24} />
  }

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Contact Items */}
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 items-center">
                <div className="flex-shrink-0">
                  {getIcon(item.type)}
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-1">{item.label}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-400">{item.content}</p>
                </div>
              </div>
            ))}

            {/* Map */}
            <div className="w-full">
              <ApplyLocationMap title="Mandaluyong College of Science and Technology" />
            </div>
          </div>

          {/* Right Image */}
          <div className="relative w-full h-96 md:h-[520px] rounded-2xl overflow-hidden shadow-lg">
            <Image src={sectionImage} alt="MCST Campus" fill className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  )
}
