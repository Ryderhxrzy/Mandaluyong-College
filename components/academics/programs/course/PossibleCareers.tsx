interface Career {
  career_title: string
  career_description: string
}

interface SectionContent {
  section_title?: string
  section_sub_title?: string
  section_description?: string
}

export default function PossibleCareers({
  careers = [],
  sectionContent
}: {
  careers?: Career[]
  sectionContent?: SectionContent
}) {
  // If no careers are provided, show message
  if (!careers || careers.length === 0) {
    return (
      <section className="bg-gray-50 dark:bg-gray-800 py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">Possible Careers</h2>
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No career information available for this program.</p>
          </div>
        </div>
      </section>
    )
  }

  const defaultSectionContent: SectionContent = {
    section_title: 'Possible Careers',
    section_sub_title: 'A Bachelor of Arts in Communication opens the door to a wide array of exciting and meaningful career paths. Whether you\'re passionate about media, public relations, digital content, or organizational communication, this program equips you with the skills to thrive in today\'s fast-paced communication landscape.',
    section_description: 'Whether your goal is to be a voice in media, a strategist in business, or a storyteller in digital platforms — a BA in Communication empowers you to lead, connect, and create meaningful change in any field you choose.',
  }

  const content = sectionContent || defaultSectionContent

  return (
    <section className="bg-gray-50 dark:bg-gray-800 py-20 md:py-28">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            {content.section_title || 'Possible Careers'}
          </h2>
          {content.section_sub_title && (
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl">
              {content.section_sub_title}
            </p>
          )}
        </div>

        {/* Career Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {careers.map((career, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6 md:p-8 text-gray-900 dark:text-white"
            >
              <h3 className="text-xl font-bold mb-3">{career.career_title}</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{career.career_description}</p>
            </div>
          ))}
        </div>

        {/* Bottom Text */}
        {content.section_description && (
          <p className="text-center text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto">
            {content.section_description}
          </p>
        )}
      </div>
    </section>
  )
}
