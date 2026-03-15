import { CheckCircle } from 'lucide-react'
import Image from 'next/image'

export default function Qualifications() {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Qualifications Text */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 dark:text-white">
              Qualifications
            </h2>
            <ul className="space-y-4">
              <li className="flex items-center gap-4">
                <CheckCircle className="text-primary flex-shrink-0" size={16} />
                <span className="text-gray-700 dark:text-gray-300">
                  A Certified Resident of Mandaluyong
                </span>
              </li>
              <li className="flex items-center gap-4">
                <CheckCircle className="text-primary flex-shrink-0" size={16} />
                <span className="text-gray-700 dark:text-gray-300">
                  Academic Excellence with a Minimum 85.00% General Weighted Average (GWA)
                </span>
              </li>
              <li className="flex items-center gap-4">
                <CheckCircle className="text-primary flex-shrink-0" size={16} />
                <span className="text-gray-700 dark:text-gray-300">
                  Senior High School Graduates, Ongoing/Graduating Grade 12 Students, and Graduates of the Old Curriculum
                </span>
              </li>
              <li className="flex items-center gap-4">
                <CheckCircle className="text-primary flex-shrink-0" size={16} />
                <span className="text-gray-700 dark:text-gray-300">
                  Applicants who have taken college units may be considered; however, no units taken previously shall be credited except NSTP, and TOR shall be validated
                </span>
              </li>
            </ul>
          </div>

          {/* Right Column - Campus Image */}
          <div className="relative h-96 md:h-full min-h-[400px]">
            <Image
              src="/campus.png"
              alt="Mandaluyong College Campus"
              fill
              className="object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
