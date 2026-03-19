interface TermsAndConditionProps {
  initialSections?: { id: number; content: string }[]
}

export default function TermsAndCondition({ initialSections }: TermsAndConditionProps) {
  const sections = initialSections?.length ? initialSections : [
    {
      id: 1,
      content: 'By accessing or using the official website of Mandaluyong College of Science and Technology, you agree to comply with and be bound by these terms and conditions. Please read them carefully before using our services.'
    },
    {
      id: 2,
      content: 'All content, graphics, and materials on this website are the intellectual property of Mandaluyong College of Science and Technology and are protected by applicable copyright laws. You may not reproduce, modify, distribute, or republish content without prior written permission.'
    },
    {
      id: 3,
      content: 'The university reserves the right to change, suspend, or discontinue any aspect of the website at any time without notice. We may also modify these terms at any time and your continued use constitutes acceptance of those changes.'
    },
    {
      id: 4,
      content: 'Users must not misuse this website. Engaging in illegal activities, unauthorized access, or transmitting harmful software is strictly prohibited.'
    },
    {
      id: 5,
      content: 'While we strive to maintain accurate and updated information, Mandaluyong College of Science and Technology does not guarantee completeness or accuracy. We are not liable for any loss or damage arising from your reliance on the content.'
    },
    {
      id: 6,
      content: 'These terms are governed by Philippine law. Any disputes arising in connection with the use of this website shall be subject to the exclusive jurisdiction of the Philippine courts.'
    },
    {
      id: 7,
      content: 'If you have questions about our terms, please reach out at: registrarsoffice@mcst.edu.ph.'
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Content Section */}
      <div className="py-12 md:py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
          {/* Content */}
          <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            {sections.map((section) => (
              <p key={section.id}>{section.content}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

