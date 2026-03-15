import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export interface JoinCommunityImage {
  id: string
  image: string
  altText: string
}

interface AboutJoinCommunityProps {
  title?: string
  description?: string
  images?: JoinCommunityImage[]
  previewMode?: boolean
}

export default function AboutJoinCommunity({
  title = 'Advancing Science.\nEmpowering Mandaleños.',
  description = 'At Mandaluyong College of Science and Technology, we champion excellence in instruction, innovation, and inclusive education. Our commitment is rooted in public service, research, and producing globally competitive graduates with a strong sense of nationalism. Be part of a future-forward institution shaping the leaders of tomorrow.',
  images = [
    { id: '1', image: '/join1.jpg', altText: 'MCST Building' },
    { id: '2', image: '/join2.jpg', altText: 'MCST Campus' },
  ],
  previewMode = false,
}: AboutJoinCommunityProps) {
  const isStackedLayout = previewMode

  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
        <div className={isStackedLayout ? 'flex flex-col gap-12' : 'grid md:grid-cols-2 gap-12 items-center'}>
          {/* Left Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              {title.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < title.split('\n').length - 1 && <br />}
                </span>
              ))}
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-400 mb-8 leading-relaxed">
              {description}
            </p>
            <Link
              href="/admissions"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-[#003a7a] transition"
            >
              Join the MCST Community <ArrowRight size={20} />
            </Link>
          </div>

          {/* Right Images Grid */}
          <div className="grid grid-cols-2 gap-4 auto-rows-max">
            {images.length > 0 && images[0].image && (
              <div className="col-span-2 relative w-full h-80 sm:h-96 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={images[0].image}
                  alt={images[0].altText}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            {images.length > 1 && images[1].image && (
              <div className="col-span-2 relative w-full h-64 sm:h-72 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={images[1].image}
                  alt={images[1].altText}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            {images.length > 2 &&
              images.slice(2).map((image) => (
                image.image && (
                  <div
                    key={image.id}
                    className="col-span-2 relative w-full h-64 sm:h-72 rounded-lg overflow-hidden shadow-lg"
                  >
                    <Image src={image.image} alt={image.altText} fill className="object-contain" />
                  </div>
                )
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}
