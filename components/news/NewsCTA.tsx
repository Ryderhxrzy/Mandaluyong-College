import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export default function NewsCTA() {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Stay Informed, Stay Inspired
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Discover the latest updates, achievements, and innovations happening at Mandaluyong College of Science and Technology. We bring you stories of impact, community, and the future we&apos;re building together.
            </p>
            <Link
              href="https://www.facebook.com/MandaluyongCST?_rdc=2&_rdr#"
              className="inline-flex items-center gap-2 bg-primary hover:bg-[#003a7a] text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              View All News
              <ArrowRight size={20} />
            </Link>
          </div>

          {/* Right Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative h-48 sm:h-64 rounded-xl overflow-hidden">
              <Image
                src="/news1.jpg"
                alt="News announcement"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-48 sm:h-64 rounded-xl overflow-hidden">
              <Image
                src="/campus.png"
                alt="Campus building"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
