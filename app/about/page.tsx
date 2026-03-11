import Image from 'next/image'

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @media (max-width: 640px) {
          .banner-section {
            background-position: center 20% !important;
          }
        }
      `}</style>

      {/* Banner Section */}
      <section
        className="banner-section relative w-full h-[240px] sm:h-[300px] md:h-[600px] flex items-center justify-center overflow-hidden -mt-14 md:-mt-16"
        style={{
          backgroundImage: `url('/banner.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'scroll',
        }}
      >
        {/* Opacity Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
      </section>

      {/* Key Statistics Section */}
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
                  <h3 className="text-3xl font-bold text-blue-600 mb-2">420+</h3>
                  <p className="text-gray-700">Students enrolled in diverse academic programs.</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                  <h3 className="text-3xl font-bold text-blue-600 mb-2">20+</h3>
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

      {/* Goals & Philosophy */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              {/* Goals */}
              <div className="mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Goals</h2>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-bold mt-1">•</span>
                    <span className="text-gray-700">Provide Mandaleño access to quality higher education.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-bold mt-1">•</span>
                    <span className="text-gray-700">Support optimum advancement in instruction, technology, research, innovation, and resource generation.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-bold mt-1">•</span>
                    <span className="text-gray-700">Collaborate with various educational, technical, and professional stakeholders for genuine public service.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-bold mt-1">•</span>
                    <span className="text-gray-700">Foster institutional effectiveness and efficiency for continuous improvement and total quality management.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-bold mt-1">•</span>
                    <span className="text-gray-700">Produce graduates who are locally and internationally competent with a high sense of nationalism.</span>
                  </li>
                </ul>
              </div>

              {/* Philosophy */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Philosophy</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Mandaluyong College of Science and Technology advocates the culture of excellence in science and technology that is anchored on the principles of quality instruction, dynamic research and innovation, continuous improvement, public service, and nationalism.
                </p>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-4 border-gray-200 shadow-lg">
              <Image src="/goals.jpg" alt="MCST Goals" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                To cultivate a culture of excellence in Science and Technology pursuing the improvement of the quality of life of every Mandaleño to bring about the city&apos;s sustainable development and resiliency towards nation building.
              </p>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Our Vision</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                A college of distinction in Science and Technology committed to produce high caliber and employable graduates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Leadership Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Dr. Maria Santos', title: 'President' },
              { name: 'Mr. Juan Cruz', title: 'Vice President for Academics' },
              { name: 'Ms. Ana Martinez', title: 'Vice President for Student Affairs' },
            ].map((member) => (
              <div key={member.name} className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-gray-600 font-medium">{member.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
