import Image from 'next/image'

export interface CoreValueItem {
  id: string
  name: string
  description: string
}

interface AboutCoreValuesSectionProps {
  title?: string
  description?: string
  image?: string
  campusTitle?: string
  campusDescription?: string
  items?: CoreValueItem[]
  previewMode?: boolean
}

export default function AboutCoreValuesSection({
  title = 'Mandaluyong College of Science and Technology',
  description = 'MCST Core Values represent the shared beliefs of the Mandaleño. These beliefs define a genuine Mandaleño through six key ideals:',
  image = '/mcst-core.jpg',
  campusTitle = 'Our Campus',
  campusDescription = 'A center of excellence fostering academic growth, character development, and community service in the heart of Mandaluyong.',
  items = [
    { id: '1', name: 'Naglilingkod', description: 'Genuine service to the general public.' },
    { id: '2', name: 'Kumakalinga', description: 'Caring and nurturing people, the environment, and the country.' },
    { id: '3', name: 'Disiplinado', description: 'Integrity anchored on responsibility and accountability.' },
    { id: '4', name: 'Gawa Hindi Salita', description: 'Known for actions rather than words.' },
    { id: '5', name: 'Makabansa', description: 'High sense of nationalism and concern for the greater good.' },
    { id: '6', name: 'Kahusayan', description: 'Academic excellence, effective governance, and leadership.' },
  ],
  previewMode = false,
}: AboutCoreValuesSectionProps) {
  // For preview mode or mobile, use stacked layout with image at bottom
  const isStackedLayout = previewMode

  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
        <div className={isStackedLayout ? 'flex flex-col gap-12' : 'grid md:grid-cols-2 gap-12 items-center'}>
          {/* Left Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h2>
            <p className="text-lg text-gray-700 dark:text-gray-400 mb-8">
              {description}
            </p>

            {/* Core Values List */}
            <div className="space-y-3">
              {items.map((item) => (
                <p key={item.id} className="text-base text-gray-700 dark:text-gray-300">
                  <span className="font-bold text-primary">{item.name}:</span> {item.description}
                </p>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="flex flex-col items-center">
            {image && (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-4 border-gray-300 dark:border-gray-600 shadow-lg mb-6">
                <Image src={image} alt="MCST Campus" fill className="object-cover" />
              </div>
            )}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{campusTitle}</h3>
              <p className="text-lg text-gray-700 dark:text-gray-400">
                {campusDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
