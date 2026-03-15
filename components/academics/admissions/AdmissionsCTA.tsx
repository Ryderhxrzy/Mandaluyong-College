import Image from 'next/image'

export interface AdmissionsImage {
  id: string
  image: string
  altText: string
}

interface AdmissionsCTAProps {
  title?: string
  description?: string
  images?: AdmissionsImage[]
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
}: AdmissionsCTAProps) {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
        {/* Desktop Layout: Content Left, Images Right */}
        <div className="hidden lg:grid grid-cols-2 gap-12 items-center">
          {/* Left Side: Title and Description */}
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
              {title}
            </h2>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-400">
              {description}
            </p>
          </div>

          {/* Right Side: Images Grid - 2 Per Row */}
          <div className="grid grid-cols-2 gap-3 h-fit sticky top-32">
            {images.map((img) => (
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
            {images.map((img) => (
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
              {title}
            </h2>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-400">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
