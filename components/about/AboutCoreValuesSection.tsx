import Image from 'next/image'

export default function AboutCoreValuesSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Mandaluyong College of Science and Technology</h2>
            <p className="text-lg text-gray-700 mb-8">
              MCST Core Values represent the shared beliefs of the Mandaleño. These beliefs define a genuine Mandaleño through six key ideals:
            </p>

            {/* Core Values List */}
            <div className="space-y-3">
              <p className="text-base text-gray-700">
                <span className="font-bold text-primary">Naglilingkod:</span> Genuine service to the general public.
              </p>
              <p className="text-base text-gray-700">
                <span className="font-bold text-primary">Kumakalinga:</span> Caring and nurturing people, the environment, and the country.
              </p>
              <p className="text-base text-gray-700">
                <span className="font-bold text-primary">Disiplinado:</span> Integrity anchored on responsibility and accountability.
              </p>
              <p className="text-base text-gray-700">
                <span className="font-bold text-primary">Gawa Hindi Salita:</span> Known for actions rather than words.
              </p>
              <p className="text-base text-gray-700">
                <span className="font-bold text-primary">Makabansa:</span> High sense of nationalism and concern for the greater good.
              </p>
              <p className="text-base text-gray-700">
                <span className="font-bold text-primary">Kahusayan:</span> Academic excellence, effective governance, and leadership.
              </p>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex flex-col items-center">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-4 border-gray-300 shadow-lg mb-6">
              <Image src="/mcst-core.jpg" alt="MCST Campus" fill className="object-cover" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Campus</h3>
              <p className="text-lg text-gray-700">
                A center of excellence fostering academic growth, character development, and community service in the heart of Mandaluyong.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
