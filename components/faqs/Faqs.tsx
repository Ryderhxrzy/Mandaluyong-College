'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FaqItem {
  id: number
  question: string
  answer: string
  order?: number
}

interface FaqsProps {
  initialItems?: FaqItem[]
}

export default function Faqs({ initialItems }: FaqsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = initialItems?.length ? initialItems : [
    {
      id: 1,
      question: 'What programs are offered?',
      answer: 'Mandaluyong College of Science and Technology offers a diverse range of programs. These include Bachelor of Arts in Communication, Bachelor of Science in Information Systems, and Bachelor of Science in Mathematics.',
    },
    {
      id: 2,
      question: 'If I am a graduate of the old curriculum, and not of K-12, can I be accepted?',
      answer: 'According to CHED Memorandum 10 s. 2017, you can be accepted but you will undergo a bridging program to catch up on the subjects you should have taken at the SHS (Senior High School) level.',
    },
    {
      id: 3,
      question: 'Will I be accepted if my final average is 84 or lower?',
      answer: 'Based on the signed Board Resolution 008 s. 2023 of MCST, only students with a final average of 85 or higher can be accepted for the first year of operation.',
    },
  ]

  const toggleQuestion = (id: number) => {
    setOpenIndex(openIndex === id ? null : id)
  }

  return (
    <>
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleQuestion(item.id)}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center justify-between group cursor-pointer"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-left">
                    {item.question}
                  </h3>
                  <ChevronDown
                    size={24}
                    className={`flex-shrink-0 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all ${
                      openIndex === item.id ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                    }`}
                  />
                </button>
                {openIndex === item.id && (
                  <div className="px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed tabular-nums">
                      {item.answer}
                    </p>
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


