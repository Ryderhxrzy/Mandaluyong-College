import Link from 'next/link'
import { ArrowRight, Users, Award, BookOpen, Target } from 'lucide-react'
import ProgramsCarousel from '@/components/ProgramsCarousel'

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

        {/* Hero Section Content */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16 py-12 sm:py-16">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold mb-4 sm:mb-6 leading-tight tracking-tight">
            <span className="text-white block mb-1 sm:mb-2">Shaping Tomorrow's Innovators at</span>
            <span style={{ color: '#50a2ff' }} className="block">Mandaluyong College of Science and Technology</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-10 text-white max-w-4xl leading-relaxed font-medium">
            Discover a future built on innovation and excellence. Our programs in Information Systems, Mathematics, Communication, Public Administration, and Physical Education equip students with the skills and mindset to thrive in a technology-driven world.
          </p>
          <div className="flex flex-row gap-2 sm:gap-4">
            <Link
              href="/admissions"
              className="bg-primary text-white px-4 sm:px-8 py-2 sm:py-3 rounded-md font-medium hover:bg-[#003a7a] transition flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base border border-primary whitespace-nowrap"
            >
              Apply Now <ArrowRight size={16} />
            </Link>
            <Link
              href="/academics"
              className="border border-white text-white px-4 sm:px-8 py-2 sm:py-3 rounded-md font-medium hover:bg-white/10 transition flex items-center justify-center text-xs sm:text-sm md:text-base whitespace-nowrap"
            >
              Explore Programs
            </Link>
          </div>
        </div>
      </section>

      {/* Institutional Content */}
      <div className="bg-white dark:bg-gray-900">
        {/* Institutional Overview */}
        <section className="py-10 md:py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <div className="w-full px-4 sm:px-8 md:px-16 max-w-[1400px] mx-auto">
            <div className="text-center mb-6 md:mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Our Commitment to Academic Excellence
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-gray-700 transition duration-300 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-2 transition">
                  <Users className="text-primary" size={20} />
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1">420+</div>
                <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium">Students Enrolled</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-gray-700 transition duration-300 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full mb-2 transition">
                  <Award className="text-green-600" size={20} />
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600 mb-1">20+</div>
                <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium">Faculty Members</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-gray-700 transition duration-300 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-2 transition">
                  <BookOpen className="text-purple-600" size={20} />
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-600 mb-1">5</div>
                <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium">Degree Programs</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-gray-700 transition duration-300 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-2 transition">
                  <Target className="text-amber-500" size={20} />
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-500 mb-1">100%</div>
                <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium">Commitment to Excellence</p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section
          className="relative w-full py-24 md:py-32 flex items-center justify-center text-center overflow-hidden"
          style={{
            backgroundImage: 'url(/campus.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/65"></div>

          {/* Content */}
          <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-8 md:px-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-8 leading-tight" style={{ color: '#50a2ff' }}>
              Core Values That Drive Excellence at Mandaluyong College of Science and Technology
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-white leading-relaxed font-normal max-w-3xl mx-auto">
              At MCST, we are committed to genuine public service and fostering care within our community. Our core values of <span className="font-bold">discipline, action over words, nationalism, and excellence</span> guide us in shaping responsible and innovative leaders.
            </p>
          </div>
        </section>

        {/* Education Commitment */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          <div className="w-full px-4 sm:px-8 md:px-16 max-w-[1400px] mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Our Commitment to Quality Education and Innovation
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                At Mandaluyong College of Science and Technology, we strive to provide accessible, high-quality education that empowers our students. Our dedication to advancing instruction and research ensures that we remain at the forefront of academic excellence.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {/* Card 1 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 text-center transition">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                  <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Collaborating for a Brighter Future
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  We actively collaborate with stakeholders to enhance educational outcomes.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 text-center transition">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Continuous Improvement in Education
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  Our focus on continuous improvement drives us to innovate and adapt.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 text-center transition">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4">
                  <svg className="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Fostering Excellence in Research and Instruction
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  We prioritize research initiatives that contribute to societal development.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Programs Section - Carousel */}
        <ProgramsCarousel />

        {/* CTA Section */}
        <section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-16">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">Ready to Shape Your Future?</h2>
            <p className="text-sm sm:text-base md:text-xl mb-8 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Join a vibrant academic community where leadership, innovation, and excellence thrive. Whether you&apos;re just beginning or advancing your path, we&apos;re here to empower your journey.
            </p>
            <Link
              href="/admissions"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-[#003a7a] transition"
            >
              Apply Now <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
