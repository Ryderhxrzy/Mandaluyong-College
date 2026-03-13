import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function AboutJoinCommunity() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Advancing Science.<br />Empowering Mandaleños.
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              At Mandaluyong College of Science and Technology, we champion excellence in instruction, innovation, and inclusive education. Our commitment is rooted in public service, research, and producing globally competitive graduates with a strong sense of nationalism. Be part of a future-forward institution shaping the leaders of tomorrow.
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
            <div className="col-span-2 relative w-full h-80 sm:h-96 rounded-lg overflow-hidden shadow-lg">
              <Image src="/join1.jpg" alt="MCST Building" fill className="object-cover" />
            </div>
            <div className="col-span-2 relative w-full h-64 sm:h-72 rounded-lg overflow-hidden shadow-lg">
              <Image src="/join2.jpg" alt="MCST Campus" fill className="object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
