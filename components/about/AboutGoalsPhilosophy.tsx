import Image from 'next/image'
import { CheckCircle } from 'lucide-react'

export interface GoalItem {
  id: string
  description: string
}

interface AboutGoalsPhilosophyProps {
  goalTitle?: string
  goalItems?: GoalItem[]
  philosophyTitle?: string
  philosophyDescription?: string
  philosophyImage?: string
  philosophyImageAlt?: string
  previewMode?: boolean
}

const DEFAULT_GOALS_ITEMS: GoalItem[] = [
  {
    id: '1',
    description: 'Provide Mandaleño access to quality higher education.',
  },
  {
    id: '2',
    description: 'Support optimum advancement in instruction, technology, research, innovation, and resource generation.',
  },
  {
    id: '3',
    description: 'Collaborate with various educational, technical, and professional stakeholders for genuine public service.',
  },
  {
    id: '4',
    description: 'Foster institutional effectiveness and efficiency for continuous improvement and total quality management.',
  },
  {
    id: '5',
    description: 'Produce graduates who are locally and internationally competent with a high sense of nationalism.',
  },
]

export default function AboutGoalsPhilosophy({
  goalTitle = 'Goals',
  goalItems = DEFAULT_GOALS_ITEMS,
  philosophyTitle = 'Philosophy',
  philosophyDescription = 'Mandaluyong College of Science and Technology advocates the culture of excellence in science and technology that is anchored on the principles of quality instruction, dynamic research and innovation, continuous improvement, public service, and nationalism.',
  philosophyImage = '/goals.jpg',
  philosophyImageAlt = 'MCST Goals',
  previewMode = false,
}: AboutGoalsPhilosophyProps) {
  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
        {/* Desktop Layout: Content Left, Image Right */}
        <div className={`${previewMode ? 'hidden' : 'hidden md:grid'} md:grid-cols-2 gap-12 items-center`}>
          {/* Left Content */}
          <div>
            {/* Goals */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">{goalTitle}</h2>
              <ul className="space-y-4">
                {goalItems.map((item) => (
                  <li key={item.id} className="flex gap-3 items-center">
                    <CheckCircle className="text-primary flex-shrink-0" size={16} />
                    <span className="text-gray-700 dark:text-gray-300">{item.description}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Philosophy */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">{philosophyTitle}</h2>
              <p className="text-lg text-gray-700 dark:text-gray-400 leading-relaxed">
                {philosophyDescription}
              </p>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-4 border-gray-200 dark:border-gray-600 shadow-lg">
            {philosophyImage ? (
              <Image src={philosophyImage} alt={philosophyImageAlt} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>
        </div>

        {/* Mobile/Preview Layout: Content First, Image at Bottom */}
        <div className={`${previewMode ? 'block' : 'md:hidden'} space-y-8`}>
          {/* Goals */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">{goalTitle}</h2>
            <ul className="space-y-4">
              {goalItems.map((item) => (
                <li key={item.id} className="flex gap-3 items-center">
                  <CheckCircle className="text-primary flex-shrink-0" size={16} />
                  <span className="text-gray-700 dark:text-gray-300">{item.description}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Philosophy */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">{philosophyTitle}</h2>
            <p className="text-lg text-gray-700 dark:text-gray-400 leading-relaxed">
              {philosophyDescription}
            </p>
          </div>

          {/* Image at Bottom */}
          <div className="relative w-full h-64 rounded-2xl overflow-hidden border-4 border-gray-200 dark:border-gray-600 shadow-lg">
            {philosophyImage ? (
              <Image src={philosophyImage} alt={philosophyImageAlt} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
