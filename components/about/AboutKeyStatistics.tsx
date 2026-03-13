import Image from 'next/image'

export interface StatItem {
  id: string
  value: string
  label: string
}

export interface StatImage {
  id: string
  image: string
  altText: string
}

interface AboutKeyStatisticsProps {
  title?: string
  description?: string
  items?: StatItem[]
  images?: StatImage[]
  previewMode?: boolean
}

const DEFAULT_ITEMS: StatItem[] = [
  {
    id: '1',
    value: '420+',
    label: 'Students enrolled in diverse academic programs.',
  },
  {
    id: '2',
    value: '20+',
    label: 'Dedicated faculty and staff supporting student success.',
  },
]

const DEFAULT_IMAGES: StatImage[] = [
  { id: '1', image: '/1.webp', altText: 'MCST Campus Life' },
  { id: '2', image: '/2.webp', altText: 'MCST Students' },
  { id: '3', image: '/3.webp', altText: 'MCST Community' },
  { id: '4', image: '/4.webp', altText: 'MCST Excellence' },
]

export default function AboutKeyStatistics({
  title = 'Discover Our Impact: Key Statistics at Mandaluyong College of Science and Technology',
  description = 'At MCST, we pride ourselves on our vibrant community. Our commitment to excellence is reflected in our impressive statistics.',
  items = DEFAULT_ITEMS,
  images = DEFAULT_IMAGES,
  previewMode = false,
}: AboutKeyStatisticsProps) {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
        {/* Desktop Layout: All Content Left, Images Right - Hidden in Preview Mode */}
        <div className={`${previewMode ? 'hidden' : 'hidden lg:grid'} grid-cols-2 gap-12 items-center`}>
          {/* Left Side: Title, Description, and Cards */}
          <div>
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
                {title}
              </h2>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-400">
                {description}
              </p>
            </div>

            {/* Stats Cards */}
            <div className="space-y-4 sm:space-y-6">
              {items.map((item) => (
                <div key={item.id} className="bg-blue-50 dark:bg-blue-900/20 p-4 sm:p-6 rounded-lg border border-blue-100 dark:border-blue-800">
                  <h3 className="text-2xl sm:text-3xl font-bold text-primary mb-2">{item.value}</h3>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Images Grid - 2 Per Row */}
          <div className="grid grid-cols-2 gap-4 h-fit sticky top-32">
            {images.map((img) => (
              <div key={img.id} className="w-full rounded-lg overflow-hidden shadow-lg">
                {img.image ? (
                  <Image src={img.image} alt={img.altText} width={400} height={300} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-72 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile/Tablet Layout: Cards First, Images at Bottom - Always Shown in Preview Mode */}
        <div className={`${previewMode ? 'block' : 'lg:hidden'} space-y-8`}>
          {/* Title and Description */}
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
              {title}
            </h2>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-400">
              {description}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="space-y-4 sm:space-y-6">
            {items.map((item) => (
              <div key={item.id} className="bg-blue-50 dark:bg-blue-900/20 p-4 sm:p-6 rounded-lg border border-blue-100 dark:border-blue-800">
                <h3 className="text-2xl sm:text-3xl font-bold text-primary mb-2">{item.value}</h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Images Grid - 2 Per Row on Tablet, 1 on Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {images.map((img) => (
              <div key={img.id} className="w-full rounded-lg overflow-hidden shadow-lg">
                {img.image ? (
                  <Image src={img.image} alt={img.altText} width={400} height={300} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-56 sm:h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
