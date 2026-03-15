'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function Faqs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const questions = [
    {
      q: 'What programs are offered?',
      a: 'Mandaluyong College of Science and Technology offers a diverse range of programs. These include Bachelor of Arts in Communication, Bachelor of Science in Information Systems, and Bachelor of Science in Mathematics.',
    },
    {
      q: 'If I am a graduate of the old curriculum, and not of K-12, can I be accepted?',
      a: 'According to CHED Memorandum 10 s. 2017, you can be accepted but you will undergo a bridging program to catch up on the subjects you should have taken at the SHS (Senior High School) level.',
    },
    {
      q: 'Will I be accepted if my final average is 84 or lower?',
      a: 'Based on the signed Board Resolution 008 s. 2023 of MCST, only students with a final average of 85 or higher can be accepted for the first year of operation.',
    },
  ]

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <>
      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Centered Title */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {questions.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center justify-between group cursor-pointer"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-left">
                    {item.q}
                  </h3>
                  <ChevronDown
                    size={24}
                    className={`flex-shrink-0 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all ${
                      openIndex === index ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                    }`}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
