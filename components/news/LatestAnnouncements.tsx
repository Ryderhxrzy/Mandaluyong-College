import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export interface Announcement {
  id: number
  image_url: string
  title: string
  description: string
  link_url?: string
}

interface LatestAnnouncementsProps {
  initialAnnouncements?: Announcement[]
}

export default function LatestAnnouncements({ initialAnnouncements }: LatestAnnouncementsProps) {
  const announcements = initialAnnouncements?.length ? initialAnnouncements : [
    {
      id: 1,
      image_url: '/news1.jpg',
      title: 'Bachelor of Science in Nursing',
      description: 'Nursing education teaches healing while fostering compassion, resilience, and a strong commitment to serving others.',
      link_url: 'https://www.facebook.com/MandaluyongCST?_rdc=2&_rdr#',
    },
    {
      id: 2,
      image_url: '/news2.jpg',
      title: 'Bachelor of Public Administration',
      description: 'Mandaluyong College of Science and Technology now offers Public Administration.',
      link_url: 'https://www.facebook.com/MandaluyongCST?_rdc=2&_rdr#',
    },
    {
      id: 3,
      image_url: '/news3.jpg',
      title: 'Bachelor of Physical Education',
      description: 'Mandaluyong College of Science and Technology now offers Physical Education.',
      link_url: 'https://www.facebook.com/MandaluyongCST?_rdc=2&_rdr#',
    },
  ]

  return (
    <section className="w-full py-12 bg-white dark:bg-gray-900">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Latest Announcements
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements.map((announcement) => (
            <Link
              key={announcement.id}
              href={announcement.link_url || 'https://www.facebook.com/MandaluyongCST?_rdc=2&_rdr#'}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer group block"
            >
              {/* Image Container */}
              <div className="relative h-48 w-full">
                <Image
                  src={announcement.image_url}
                  alt={announcement.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content Container */}
              <div className="p-6 flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {announcement.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {announcement.description}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors ml-3 flex-shrink-0 mt-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
