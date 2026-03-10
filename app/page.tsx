import Link from 'next/link'
import { ArrowRight, Users, Award, BookOpen, Target } from 'lucide-react'

export default function Home() {
  return (
    <>
      {/* Hero Section with Background Image - Full Screen */}
      <section
        className="relative w-full min-h-screen flex items-center text-white overflow-hidden -mt-16 md:-mt-20"
        style={{
          backgroundImage: 'url(/mcst.jpg)',
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Overlay - Darker */}
        <div className="absolute inset-0 bg-black/70"></div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-8 md:px-16 py-8">
          <h1 className="text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-extrabold mb-6 leading-tight tracking-tight">
            <span className="text-white block mb-2">Shaping Tomorrow's Innovators at</span>
            <span style={{ color: '#50a2ff' }} className="block">Mandaluyong College of Science and Technology</span>
          </h1>
          <p className="text-lg md:text-xl mb-10 text-white max-w-4xl leading-relaxed font-medium">
            Discover a future built on innovation and excellence. Our programs in Information Systems, Mathematics, Communication, Public Administration, and Physical Education equip students with the skills and mindset to thrive in a technology-driven world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/admissions"
              className="bg-primary text-white px-8 py-3 rounded-md font-medium hover:bg-[#003a7a] transition flex items-center justify-center gap-2 w-fit text-sm md:text-base border border-primary"
            >
              Apply Now <ArrowRight size={20} />
            </Link>
            <Link
              href="/academics"
              className="border border-white text-white px-8 py-3 rounded-md font-medium hover:bg-white/10 transition flex items-center justify-center w-fit text-sm md:text-base"
            >
              Explore Programs
            </Link>
          </div>
        </div>
      </section>

      {/* Rest of the Page Content */}
      <div className="bg-white">
        {/* Institutional Overview */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="w-full px-8 md:px-16 max-w-[1400px] mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
              By The Numbers
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <div className="text-5xl font-bold text-primary mb-2">420+</div>
                <p className="text-gray-700 text-lg">Students Enrolled</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <div className="text-5xl font-bold text-primary mb-2">20+</div>
                <p className="text-gray-700 text-lg">Faculty Members</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <div className="text-5xl font-bold text-primary mb-2">5</div>
                <p className="text-gray-700 text-lg">Degree Programs</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <div className="text-5xl font-bold text-primary mb-2">100%</div>
                <p className="text-gray-700 text-lg">Commitment to Excellence</p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-16 md:py-24">
          <div className="w-full px-8 md:px-16 max-w-[1400px] mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
              Our Core Values
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg border-l-4 border-primary">
                <Target className="text-primary mb-4" size={32} />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Discipline</h3>
                <p className="text-gray-700">
                  Fostering self-control and commitment to excellence in all endeavors.
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-lg border-l-4 border-green-600">
                <Award className="text-green-600 mb-4" size={32} />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Excellence</h3>
                <p className="text-gray-700">
                  Pursuing the highest standards in academics and personal growth.
                </p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-lg border-l-4 border-red-600">
                <Users className="text-red-600 mb-4" size={32} />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Leadership</h3>
                <p className="text-gray-700">
                  Developing responsible leaders who serve their communities.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-lg border-l-4 border-purple-600">
                <BookOpen className="text-purple-600 mb-4" size={32} />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Knowledge</h3>
                <p className="text-gray-700">
                  Empowering students through quality education and innovation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Academic Commitment */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="w-full px-8 md:px-16 max-w-[1400px] mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6 text-gray-900">
                  Our Academic Commitment
                </h2>
                <p className="text-lg text-gray-700 mb-4">
                  At Mandaluyong College, we are committed to providing accessible,
                  high-quality education that prepares students for success in their
                  chosen fields.
                </p>
                <p className="text-lg text-gray-700 mb-4">
                  Our faculty members are dedicated educators and researchers who bring
                  real-world experience and expertise to the classroom.
                </p>
                <p className="text-lg text-gray-700 mb-6">
                  We believe in continuous improvement and innovation in our teaching
                  methods and curriculum development.
                </p>
                <Link
                  href="/academics"
                  className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-[#003a7a] transition"
                >
                  Learn More About Our Programs
                </Link>
              </div>
              <div className="bg-gradient-to-br from-blue-400 to-primary rounded-lg h-96 flex items-center justify-center">
                <div className="text-center text-white">
                  <BookOpen size={80} className="mx-auto mb-4 opacity-80" />
                  <p className="text-xl font-semibold">Academic Excellence</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Programs Section */}
        <section className="py-16 md:py-24">
          <div className="w-full px-8 md:px-16 max-w-[1400px] mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
              Our Programs
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: 'Nursing', description: 'Prepare for a career in healthcare with our comprehensive nursing program.' },
                { name: 'Education', description: 'Develop teaching skills to inspire the next generation of learners.' },
                { name: 'Business Administration', description: 'Master business fundamentals and leadership principles.' },
                { name: 'Information Technology', description: 'Learn cutting-edge technology and software development.' },
                { name: 'Public Administration', description: 'Train for service in government and public sector roles.' },
              ].map((program) => (
                <div
                  key={program.name}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-primary h-40 flex items-center justify-center">
                    <BookOpen size={60} className="text-white opacity-80" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {program.name}
                    </h3>
                    <p className="text-gray-700 mb-4">{program.description}</p>
                    <Link
                      href={`/academics?program=${program.name.toLowerCase().replace(' ', '-')}`}
                      className="text-primary font-medium hover:text-[#003a7a] transition flex items-center gap-2"
                    >
                      Learn More <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-white py-16">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Join Us?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Take the first step towards your future at Mandaluyong College
            </p>
            <Link
              href="/admissions"
              className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition"
            >
              Apply Now
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
