import { CheckCircle } from 'lucide-react'
import Image from 'next/image'

export default function DocumentaryRequirement() {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
        {/* Documentary Requirements Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center pb-8 mb-8">
          {/* Left Column - Requirements */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 dark:text-white">
              Documentary Requirements
            </h2>
            <ul className="space-y-4">
              <li className="flex items-center gap-4">
                <CheckCircle className="text-primary flex-shrink-0" size={16} />
                <span className="text-gray-700 dark:text-gray-300">
                  Completely filled out Application Form
                </span>
              </li>
              <li className="flex items-center gap-4">
                <CheckCircle className="text-primary flex-shrink-0" size={16} />
                <span className="text-gray-700 dark:text-gray-300">
                  Form 138 (For ongoing Grade 12 SHS)
                </span>
              </li>
              <li className="flex items-center gap-4">
                <CheckCircle className="text-primary flex-shrink-0" size={16} />
                <span className="text-gray-700 dark:text-gray-300">
                  Certificate of Good Moral Character
                </span>
              </li>
              <li className="flex items-center gap-4">
                <CheckCircle className="text-primary flex-shrink-0" size={16} />
                <span className="text-gray-700 dark:text-gray-300">
                  PSA Birth Certificate
                </span>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle className="text-primary flex-shrink-0 mt-1" size={16} />
                <div>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Proof of Mandaluyong Residence (any ONE of the following):
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="text-primary flex-shrink-0" size={14} />
                      <span className="text-gray-700 dark:text-gray-300">
                        Voter&apos;s ID of the applicant or their parents
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="text-primary flex-shrink-0" size={14} />
                      <span className="text-gray-700 dark:text-gray-300">
                        Any government-issued ID of the student, parent/s, or legal guardian showing address in Mandaluyong City
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="text-primary flex-shrink-0" size={14} />
                      <span className="text-gray-700 dark:text-gray-300">
                        Proof of billing with Mandaluyong address named after the student or their parent/s or guardian
                      </span>
                    </li>
                  </ul>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle className="text-primary flex-shrink-0 mt-1" size={16} />
                <div>
                  <p className="text-gray-700 dark:text-gray-300 mb-1">
                    Two (2) completely filled-out Recommendation Forms by former teacher/s or the School Principal, in a sealed envelope.
                  </p>
                  <p className="text-blue-600 dark:text-blue-400 underline">
                    Download from: <a href="https://bit.ly/RecomForm2025" target="_blank" rel="noopener noreferrer">https://bit.ly/RecomForm2025</a>
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <CheckCircle className="text-primary flex-shrink-0" size={16} />
                <span className="text-gray-700 dark:text-gray-300">
                  Original & photocopy of Certificate of Rating (ALS Completer/Passer only)
                </span>
              </li>
              <li className="flex items-center gap-4">
                <CheckCircle className="text-primary flex-shrink-0" size={16} />
                <span className="text-gray-700 dark:text-gray-300">
                  Transcript of Records (TOR) with graduation date (For Associate, Certificate, Vocational, or Diploma Degree Holder)
                </span>
              </li>
            </ul>
          </div>

          {/* Right Column - Image */}
          <div className="flex items-center justify-center">
            <div className="relative w-full aspect-video rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
              <Image
                src="/mcst-core.jpg"
                alt="MCST Event 1"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Border Separator */}
        <div className="flex justify-center mb-8">
          <div className="w-1/2 border-b border-gray-300 dark:border-gray-600"></div>
        </div>

        {/* Admission Procedure Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mt-8">
          {/* Left Column - Procedure */}
          <div>
            <h3 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 dark:text-white">
              Admission Procedure
            </h3>
            <div className="space-y-6">
              <div>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <span className="font-bold">1. Fill out the pre-registration via Google Form:</span>
                </p>
                <p className="text-blue-600 dark:text-blue-400 underline ml-4">
                  <a href="https://docs.google.com/forms/d/e/1FAIpQLSc1wetVpXWkg_4nUZQeWjlHGJ2zDxdXGrNcmJrGj0EXmUtadw/viewform" target="_blank" rel="noopener noreferrer">Pre-Register Form</a>
                </p>
                <p className="text-red-600 dark:text-red-400 text-sm ml-4 mt-1">
                  Note: Failure to take the pre-registration form means invalid application.
                </p>
              </div>

              <div>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <span className="font-bold">2. Submit required documents</span> in person at the Registrar&apos;s Office (Ground Floor, Administrative Building) starting <span className="font-bold">February 17, 2025</span>
                </p>
                <p className="text-gray-700 dark:text-gray-300 ml-4">
                  Submission hours: 8:00 AM – 4:00 PM (Mon-Fri)
                </p>
                <p className="text-red-600 dark:text-red-400 text-sm ml-4 mt-1">
                  Note: Only walk-ins with complete requirements will be accommodated.
                </p>
              </div>

              <div>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-bold">3. All requirements will be assessed by the Admission Officer.</span> Once complete, the student will be scheduled for the Entrance Examination.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="flex items-center justify-center">
            <div className="relative w-full aspect-video rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
              <Image
                src="/mcst-core2.jpg"
                alt="MCST Event 2"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
