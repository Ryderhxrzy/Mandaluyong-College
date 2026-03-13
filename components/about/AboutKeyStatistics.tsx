import Image from 'next/image'

export default function AboutKeyStatistics() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Discover Our Impact: Key Statistics at Mandaluyong College of Science and Technology
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              At MCST, we pride ourselves on our vibrant community. Our commitment to excellence is reflected in our impressive statistics.
            </p>

            {/* Stats Cards */}
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <h3 className="text-3xl font-bold text-primary mb-2">420+</h3>
                <p className="text-gray-700">Students enrolled in diverse academic programs.</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <h3 className="text-3xl font-bold text-primary mb-2">20+</h3>
                <p className="text-gray-700">Dedicated faculty and staff supporting student success.</p>
              </div>
            </div>
          </div>

          {/* Right Images Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative w-full h-64 sm:h-72">
              <Image src="/1.webp" alt="MCST Campus Life" fill className="object-cover rounded-lg shadow-lg" />
            </div>
            <div className="relative w-full h-64 sm:h-72">
              <Image src="/2.webp" alt="MCST Students" fill className="object-cover rounded-lg shadow-lg" />
            </div>
            <div className="relative w-full h-64 sm:h-72">
              <Image src="/3.webp" alt="MCST Community" fill className="object-cover rounded-lg shadow-lg" />
            </div>
            <div className="relative w-full h-64 sm:h-72">
              <Image src="/4.webp" alt="MCST Excellence" fill className="object-cover rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
