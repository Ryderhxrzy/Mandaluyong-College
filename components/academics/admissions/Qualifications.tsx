import { CheckCircle } from 'lucide-react'
import Image from 'next/image'

interface QualificationItem {
  id: number
  qualification_text: string
  order_index: number
}

const DEFAULT_QUALIFICATIONS: QualificationItem[] = [
  {
    id: 1,
    qualification_text: 'A Certified Resident of Mandaluyong',
    order_index: 1,
  },
  {
    id: 2,
    qualification_text:
      'Academic Excellence with a Minimum 85.00% General Weighted Average (GWA)',
    order_index: 2,
  },
  {
    id: 3,
    qualification_text:
      'Senior High School Graduates, Ongoing/Graduating Grade 12 Students, and Graduates of the Old Curriculum',
    order_index: 3,
  },
  {
    id: 4,
    qualification_text:
      'Applicants who have taken college units may be considered; however, no units taken previously shall be credited except NSTP, and TOR shall be validated',
    order_index: 4,
  },
]

interface QualificationsProps {
  items?: QualificationItem[]
}

export default function Qualifications({ items }: QualificationsProps) {
  const displayItems = items && items.length > 0 ? items : DEFAULT_QUALIFICATIONS

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
              {displayItems.map((item) => (
                <li key={item.id} className="flex items-center gap-4">
                  <CheckCircle className="text-primary flex-shrink-0" size={16} />
                  <span className="text-gray-700 dark:text-gray-300">
                    {item.qualification_text}
                  </span>
                </li>
              ))}
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
