import Link from 'next/link'
import { BookOpen, Clock, Users, Award } from 'lucide-react'

export default function Academics() {
  const programs = [
    {
      name: 'Nursing',
      duration: '4 Years',
      description:
        'Prepare for a career in healthcare with our comprehensive nursing program. Learn clinical skills, patient care, and healthcare management.',
      features: ['Clinical Training', 'Patient Care', 'Medical Ethics'],
    },
    {
      name: 'Education',
      duration: '4 Years',
      description:
        'Develop teaching skills and educational leadership to inspire the next generation of learners.',
      features: ['Pedagogy', 'Curriculum Design', 'Student Assessment'],
    },
    {
      name: 'Business Administration',
      duration: '4 Years',
      description:
        'Master business fundamentals and develop leadership principles for successful careers in various industries.',
      features: ['Business Strategy', 'Finance', 'Management'],
    },
    {
      name: 'Information Technology',
      duration: '4 Years',
      description:
        'Learn cutting-edge technology and software development to excel in the digital industry.',
      features: ['Programming', 'Web Development', 'Data Science'],
    },
    {
      name: 'Public Administration',
      duration: '4 Years',
      description:
        'Train for service in government and public sector roles with comprehensive administrative training.',
      features: ['Government Systems', 'Public Policy', 'Administration'],
    },
    {
      name: 'Associate Degree Programs',
      duration: '2 Years',
      description:
        'Complete specialized associate degree programs to jumpstart your career in various fields.',
      features: ['Career-Focused', 'Flexible Schedules', 'Practical Skills'],
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Academic Programs</h1>
          <p className="text-xl text-blue-100">
            Discover our diverse range of degree programs designed for your success
          </p>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {programs.map((program) => (
              <div key={program.name} className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:border-blue-400 transition">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{program.name}</h3>
                  <div className="bg-blue-100 px-3 py-1 rounded-full text-sm font-semibold text-blue-600 flex items-center gap-1">
                    <Clock size={16} />
                    {program.duration}
                  </div>
                </div>
                <p className="text-gray-700 mb-6">{program.description}</p>
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Key Areas:</h4>
                  <div className="flex flex-wrap gap-2">
                    {program.features.map((feature) => (
                      <span
                        key={feature}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  href="/admissions"
                  className="text-blue-600 font-semibold hover:text-blue-800 transition"
                >
                  Learn More & Apply →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admissions Info */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Admissions Information
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <Award className="text-blue-600 mb-4" size={40} />
              <h3 className="font-bold text-gray-900 mb-2">Requirements</h3>
              <p className="text-gray-700 text-sm">
                High school diploma or equivalent, plus entrance exams.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <Users className="text-green-600 mb-4" size={40} />
              <h3 className="font-bold text-gray-900 mb-2">Class Size</h3>
              <p className="text-gray-700 text-sm">
                Small, manageable class sizes for personalized attention.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <BookOpen className="text-purple-600 mb-4" size={40} />
              <h3 className="font-bold text-gray-900 mb-2">Curriculum</h3>
              <p className="text-gray-700 text-sm">
                Modern curriculum designed for today's job market.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <Clock className="text-red-600 mb-4" size={40} />
              <h3 className="font-bold text-gray-900 mb-2">Schedules</h3>
              <p className="text-gray-700 text-sm">
                Flexible schedules including morning and evening classes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Apply?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Start your journey to success at Mandaluyong College
          </p>
          <Link
            href="/admissions"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Apply Now
          </Link>
        </div>
      </section>
    </div>
  )
}
