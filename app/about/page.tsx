import Image from 'next/image'
import { CheckCircle, BookOpen, Lightbulb, Users, Award, ArrowRight } from 'lucide-react'
import Link from 'next/link'

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
                  <li className="flex gap-3 items-center">
                    <CheckCircle className="text-primary flex-shrink-0" size={16} />
                    <span className="text-gray-700">Provide Mandaleño access to quality higher education.</span>
                  </li>
                  <li className="flex gap-3 items-center">
                    <CheckCircle className="text-primary flex-shrink-0" size={16} />
                    <span className="text-gray-700">Support optimum advancement in instruction, technology, research, innovation, and resource generation.</span>
                  </li>
                  <li className="flex gap-3 items-center">
                    <CheckCircle className="text-primary flex-shrink-0" size={16} />
                    <span className="text-gray-700">Collaborate with various educational, technical, and professional stakeholders for genuine public service.</span>
                  </li>
                  <li className="flex gap-3 items-center">
                    <CheckCircle className="text-primary flex-shrink-0" size={16} />
                    <span className="text-gray-700">Foster institutional effectiveness and efficiency for continuous improvement and total quality management.</span>
                  </li>
                  <li className="flex gap-3 items-center">
                    <CheckCircle className="text-primary flex-shrink-0" size={16} />
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

      {/* Core Values */}
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

      {/* Why Choose MCST Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Why Choose Mandaluyong College of Science and Technology?</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Discover what sets MCST apart. We are dedicated to providing transformative education, fostering innovation, and building a community committed to public service and excellence.
            </p>
          </div>

          {/* Four Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Quality Education */}
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <div className="flex justify-center mb-4">
                <BookOpen className="text-primary" size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quality Education</h3>
              <p className="text-gray-700">Comprehensive programs designed to prepare students for success.</p>
            </div>

            {/* Innovation & Research */}
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <div className="flex justify-center mb-4">
                <Lightbulb className="text-primary" size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation & Research</h3>
              <p className="text-gray-700">Dynamic research culture driving continuous improvement.</p>
            </div>

            {/* Supportive Community */}
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <div className="flex justify-center mb-4">
                <Users className="text-primary" size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Supportive Community</h3>
              <p className="text-gray-700">A caring environment where everyone is empowered to thrive.</p>
            </div>

            {/* Excellence & Service */}
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <div className="flex justify-center mb-4">
                <Award className="text-primary" size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Excellence & Service</h3>
              <p className="text-gray-700">Guided by values of integrity, nationalism, and public service.</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link
              href="/admissions"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-[#003a7a] transition"
            >
              Apply Now <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Join MCST Community Section */}
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
    </div>
  )
}
