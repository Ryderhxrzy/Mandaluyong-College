import Image from 'next/image'
import { Users, Target, Zap, Heart } from 'lucide-react'

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

      {/* History */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Our History</h2>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-lg text-gray-700 mb-4">
              Mandaluyong College was founded with the vision of providing quality education
              to the communities of Mandaluyong and the Metro Manila region. Over the years,
              we have grown from a small institution to a comprehensive college offering
              multiple degree programs across various disciplines.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              Our commitment to academic excellence and student development has earned us
              recognition as a trusted educational institution. We continue to evolve and
              adapt to meet the changing needs of our students and society.
            </p>
            <p className="text-lg text-gray-700">
              Today, Mandaluyong College stands as a beacon of educational excellence,
              dedicated to shaping tomorrow's innovators and leaders.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Discipline</h3>
              <p className="text-gray-700">
                Commitment to excellence through self-control and dedication.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Action</h3>
              <p className="text-gray-700">
                Transforming words into meaningful actions and results.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-red-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Leadership</h3>
              <p className="text-gray-700">
                Developing responsible leaders who serve their communities.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Excellence</h3>
              <p className="text-gray-700">
                Striving for the highest standards in everything we do.
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
