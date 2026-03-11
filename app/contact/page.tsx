import { Mail, Phone, MapPin } from 'lucide-react'
import Image from 'next/image'

export default function Contact() {

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-24 -mt-14 md:-mt-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Let's Talk.<br />Get in Touch with MCST
              </h1>
              <p className="text-lg md:text-xl text-blue-100">
                Whether you're a student, parent, or guest, we're here to help.
              </p>
            </div>

            {/* Right Logo */}
            <div className="flex justify-center items-center">
              <div className="relative w-48 h-48 md:w-64 md:h-64">
                <Image
                  src="/mcst-logo.png"
                  alt="MCST Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Main Campus */}
              <div className="flex gap-3 items-center">
                <div className="flex-shrink-0">
                  <MapPin className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1">Main Campus</h3>
                  <p className="text-sm text-gray-700">
                    Welfareville Compound, Barangay Addition Hills, Mandaluyong City 1550
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-3 items-center">
                <div className="flex-shrink-0">
                  <Phone className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1">Phone</h3>
                  <p className="text-sm text-gray-700">(02) 87160352</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-3 items-center">
                <div className="flex-shrink-0">
                  <Mail className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1">Email</h3>
                  <p className="text-sm text-gray-700">registrarsoffice@mcst.edu.ph</p>
                </div>
              </div>

              {/* Map */}
              <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.2487123456!2d121.!3d14.!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDAwJzAwLjAiTiAxMjHCsDAwJzAwLjAiRQ!5e0!3m2!1sen!2sph!4v1234567890"
                ></iframe>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative w-full h-96 md:h-[520px] rounded-2xl overflow-hidden shadow-lg">
              <Image src="/join2.jpg" alt="MCST Campus" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
