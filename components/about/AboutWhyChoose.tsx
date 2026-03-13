import Link from 'next/link'
import { BookOpen, Lightbulb, Users, Award, ArrowRight } from 'lucide-react'

export default function AboutWhyChoose() {
  return (
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
  )
}
