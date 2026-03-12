'use client'

import { useState } from 'react'
import { CheckCircle, Calendar, FileText, Users } from 'lucide-react'
import Image from 'next/image'

export default function Admissions() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    program: 'nursing',
    highSchoolGPA: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Admissions form submitted:', formData)
    setSubmitted(true)
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      program: 'nursing',
      highSchoolGPA: '',
      message: '',
    })
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-24 -mt-14 md:-mt-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Begin Your Future
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-6 font-medium">
                At Mandaluyong College of Science and Technology
              </p>
              <p className="text-base md:text-lg text-blue-50 leading-relaxed max-w-xl">
                Unlock your potential with world-class programs tailored for <span className="font-bold text-white">new applicants</span> and <span className="font-bold text-white">transferees</span>. Join a thriving academic community that fosters innovation, leadership, and excellence.
              </p>
            </div>

            {/* Right Logo */}
            <div className="flex justify-center items-center">
              <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 opacity-90">
                <Image
                  src="/mcst-logo.png"
                  alt="MCST Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            How to Apply
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: 'Complete Application',
                description: 'Fill out the admission application form with your personal and educational information.',
                icon: FileText,
              },
              {
                step: 2,
                title: 'Submit Documents',
                description: 'Provide required documents including high school diploma, transcripts, and ID.',
                icon: FileText,
              },
              {
                step: 3,
                title: 'Take Entrance Exam',
                description: 'Sit for our comprehensive entrance examination to assess your readiness.',
                icon: Users,
              },
              {
                step: 4,
                title: 'Receive Decision',
                description: 'Get your admission decision and enrollment instructions within 2 weeks.',
                icon: CheckCircle,
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.step} className="relative">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-8 text-center">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                      {item.step}
                    </div>
                    <Icon className="text-blue-600 mx-auto mb-4" size={32} />
                    <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-700 text-sm">{item.description}</p>
                  </div>
                  {item.step < 4 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-1 bg-blue-600 transform -translate-y-1/2"></div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Admission Requirements
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Documents Needed</h3>
              <ul className="space-y-3">
                {[
                  'High school diploma or equivalent',
                  'Certified transcript of records',
                  'Birth certificate (certified copy)',
                  'National ID or Passport',
                  '4x6 ID photos (4 pieces)',
                  'Medical/health certificate',
                  'Proof of residence',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Academic Standards</h3>
              <ul className="space-y-3">
                {[
                  'Minimum high school GPA: 2.0',
                  'Passing score on entrance exam',
                  'Proficiency in English and Math',
                  'Good moral character',
                  'Physical and mental fitness for the program',
                  'For international students: Valid passport',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Application Timeline */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Application Timeline
          </h2>
          <div className="space-y-6">
            {[
              { period: 'January - April', event: 'Regular Admissions (Fall Semester)' },
              { period: 'May - June', event: 'Late Admissions (Fall Semester)' },
              { period: 'June - August', event: 'Spring Semester Admissions Open' },
              { period: 'September - November', event: 'Regular Admissions (Spring Semester)' },
              { period: 'December', event: 'Late Admissions (Spring Semester)' },
            ].map((item, index) => (
              <div
                key={index}
                className="flex gap-6 pb-6 border-b border-gray-200 last:border-b-0"
              >
                <div className="flex-shrink-0">
                  <Calendar className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="font-semibold text-blue-600">{item.period}</p>
                  <p className="text-gray-700">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Apply Now
          </h2>
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Desired Program *
                </label>
                <select
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="nursing">Nursing</option>
                  <option value="education">Education</option>
                  <option value="business">Business Administration</option>
                  <option value="it">Information Technology</option>
                  <option value="admin">Public Administration</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  High School GPA
                </label>
                <input
                  type="number"
                  name="highSchoolGPA"
                  value={formData.highSchoolGPA}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  max="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 3.5"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Additional Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell us about yourself..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Submit Application
            </button>

            {submitted && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                Thank you for your application! We will contact you soon.
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  )
}
