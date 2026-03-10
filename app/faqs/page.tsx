'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqCategories = [
    {
      title: 'Admissions',
      questions: [
        {
          q: 'What are the admission requirements?',
          a: 'Applicants need a high school diploma or equivalent, completed application form, and passing scores on entrance examinations. Some programs may have additional requirements.',
        },
        {
          q: 'When does enrollment happen?',
          a: 'We have two main enrollment periods: Fall Semester (June-July) and Spring Semester (December-January). Please visit our admissions office for specific dates.',
        },
        {
          q: 'What is the application fee?',
          a: 'The application fee is PHP 500 (non-refundable). This covers the processing of your application and entrance examination.',
        },
        {
          q: 'Can I transfer credits from another institution?',
          a: 'Yes, we accept credit transfers from accredited institutions. Contact our Registrar\'s Office for evaluation of your transcripts.',
        },
      ],
    },
    {
      title: 'Programs & Academics',
      questions: [
        {
          q: 'How long does each degree program take?',
          a: 'Most of our degree programs take 4 years to complete. Associate degree programs take 2 years.',
        },
        {
          q: 'Are online classes available?',
          a: 'We offer a blend of in-person and online classes. Some programs may be fully online. Check with your specific program for availability.',
        },
        {
          q: 'What is the student-to-faculty ratio?',
          a: 'Our average student-to-faculty ratio is 15:1, ensuring personalized attention and quality education.',
        },
        {
          q: 'Can I change my major?',
          a: 'Yes, you can change your major during your studies. Contact the Registrar\'s Office for assistance with the process.',
        },
      ],
    },
    {
      title: 'Student Life & Support',
      questions: [
        {
          q: 'What student organizations are available?',
          a: 'We have over 30 student organizations covering academics, sports, arts, and community service. Join any that match your interests!',
        },
        {
          q: 'Are scholarships available?',
          a: 'Yes! We offer merit-based and need-based scholarships. Visit the Financial Aid Office for details and application requirements.',
        },
        {
          q: 'Is there student housing on campus?',
          a: 'We offer limited on-campus housing for qualified students. Off-campus housing referrals are also available.',
        },
        {
          q: 'What support services are available?',
          a: 'We provide academic advising, tutoring, counseling, career services, and disability support services to all students.',
        },
      ],
    },
    {
      title: 'Finance & Payments',
      questions: [
        {
          q: 'What are the tuition fees?',
          a: 'Tuition fees vary by program. Contact the Accounting Office or visit our website for a detailed fee structure.',
        },
        {
          q: 'Do you offer payment plans?',
          a: 'Yes, we offer flexible payment plans to help ease the financial burden. Contact the Accounting Office to set up a plan.',
        },
        {
          q: 'What documents do I need for enrollment?',
          a: 'You\'ll need a birth certificate, high school diploma, ID photos, and proof of residence. A complete list is available at the Registrar\'s Office.',
        },
        {
          q: 'Is financial aid available?',
          a: 'We offer various financial aid options including loans, grants, and scholarships. Apply through our Financial Aid Office.',
        },
      ],
    },
  ]

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-blue-100">
            Find answers to common questions about Mandaluyong College
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-blue-600">
                {category.title}
              </h2>
              <div className="space-y-4">
                {category.questions.map((item, itemIndex) => {
                  const globalIndex = categoryIndex * 100 + itemIndex
                  return (
                    <div
                      key={globalIndex}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleQuestion(globalIndex)}
                        className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition flex items-center justify-between"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 text-left">
                          {item.q}
                        </h3>
                        <ChevronDown
                          size={24}
                          className={`flex-shrink-0 text-blue-600 transition-transform ${
                            openIndex === globalIndex ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {openIndex === globalIndex && (
                        <div className="px-6 py-4 bg-white border-t border-gray-200">
                          <p className="text-gray-700 leading-relaxed">{item.a}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Still Have Questions? */}
      <section className="bg-blue-50 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Our team is here to help! Contact us through any of these channels.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Contact Us
            </a>
            <a
              href="tel:+6321234567"
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Call Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
