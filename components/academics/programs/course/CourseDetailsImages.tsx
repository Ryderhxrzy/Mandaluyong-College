import Image from 'next/image'

interface CourseDetailsImagesProps {
  images?: string[]
}

export default function CourseDetailsImages({
  images = [],
}: CourseDetailsImagesProps) {
  const imageCount = images.length

  // If no images are provided, show message
  if (imageCount === 0) {
    return (
      <div className="mb-16 py-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center border border-gray-300 dark:border-gray-600">
        <p className="text-gray-600 dark:text-gray-400 text-lg">No images available for this course.</p>
      </div>
    )
  }

  // Single image: Full width hero layout
  if (imageCount === 1) {
    return (
      <div className="mb-16">
        <div className="relative h-96 sm:h-[450px] md:h-[550px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          <Image
            src={images[0]}
            alt="Course image"
            fill
            className="object-cover"
          />
        </div>
      </div>
    )
  }

  // Two images: Side by side layout
  if (imageCount === 2) {
    return (
      <div className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative h-80 sm:h-96 md:h-[400px] rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <Image
                src={image}
                alt={`Course image ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Three images: Hero + 2 below layout
  if (imageCount === 3) {
    return (
      <div className="mb-16 space-y-4 sm:space-y-6">
        {/* Hero image */}
        <div className="relative h-96 sm:h-[450px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          <Image
            src={images[0]}
            alt="Course featured image"
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Two images below */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {images.slice(1, 3).map((image, index) => (
            <div
              key={index}
              className="relative h-72 sm:h-80 md:h-[300px] rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <Image
                src={image}
                alt={`Course image ${index + 2}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Four+ images: Responsive grid layout
  if (imageCount >= 4) {
    return (
      <div className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {images.slice(0, 6).map((image, index) => (
            <div
              key={index}
              className={`relative rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ${
                index === 0 ? 'md:col-span-2 lg:col-span-2 h-80 sm:h-96 md:h-[350px]' : 'h-72 sm:h-80 md:h-[300px]'
              }`}
            >
              <Image
                src={image}
                alt={`Course image ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    )
  }
}
