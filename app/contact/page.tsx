'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would send this to a backend or email service
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setFormData({ name: '', email: '', subject: '', message: '' })
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-blue-100">
            Get in touch with Mandaluyong College
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Location */}
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="text-blue-600" size={32} />
                <h3 className="text-xl font-bold text-gray-900">Location</h3>
              </div>
              <p className="text-gray-700">
                Mandaluyong City,<br />
                Metro Manila, Philippines
              </p>
            </div>

            {/* Phone */}
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="text-green-600" size={32} />
                <h3 className="text-xl font-bold text-gray-900">Phone</h3>
              </div>
              <p className="text-gray-700">
                Main: +63 2 123 4567<br />
                Admissions: +63 2 123 4568
              </p>
            </div>

            {/* Email */}
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="text-purple-600" size={32} />
                <h3 className="text-xl font-bold text-gray-900">Email</h3>
              </div>
              <p className="text-gray-700">
                info@mandaluyongcollege.edu<br />
                admissions@mandaluyongcollege.edu
              </p>
            </div>
          </div>

          {/* Office Hours */}
          <div className="bg-blue-50 rounded-lg p-8 mb-16">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="text-blue-600" size={32} />
              <h3 className="text-xl font-bold text-gray-900">Office Hours</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="font-semibold text-gray-900 mb-2">Regular Hours</p>
                <p className="text-gray-700">Monday - Friday: 8:00 AM - 5:00 PM</p>
                <p className="text-gray-700">Saturday: 8:00 AM - 12:00 PM</p>
                <p className="text-gray-700">Sunday: Closed</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Admissions Office</p>
                <p className="text-gray-700">Monday - Friday: 8:00 AM - 6:00 PM</p>
                <p className="text-gray-700">Saturday: 9:00 AM - 3:00 PM</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your message..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Send Message
              </button>

              {submitted && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  Thank you! Your message has been sent successfully.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-96 bg-gray-300">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.2487123456!2d121.!3d14.!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDAwJzAwLjAiTiAxMjHCsDAwJzAwLjAiRQ!5e0!3m2!1sen!2sph!4v1234567890"
        ></iframe>
      </section>
    </div>
  )
}
