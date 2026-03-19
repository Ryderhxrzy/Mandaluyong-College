import { CheckCircle } from 'lucide-react'
import Image from 'next/image'

interface SubRequirement {
  id: number
  requirement_text: string
  requirement_type: string
  order_index: number
}

interface DocumentaryRequirementItem {
  id: number
  requirement_text: string
  requirement_type: string
  order_index: number
  sub_requirements?: SubRequirement[]
}

interface ProcedureItem {
  id: number
  step_number: number
  step_title: string
  step_description: string | null
  link_text: string | null
  link_url: string | null
  note_text: string | null
  note_type: string | null
  order_index: number
}

interface DocumentaryRequirementProps {
  items?: DocumentaryRequirementItem[]
  procedures?: ProcedureItem[]
}

const DEFAULT_REQUIREMENTS: DocumentaryRequirementItem[] = [
  { id: 1, requirement_text: 'Completely filled out Application Form', requirement_type: 'main', order_index: 1 },
  { id: 2, requirement_text: 'Form 138 (For ongoing Grade 12 SHS)', requirement_type: 'main', order_index: 2 },
  { id: 3, requirement_text: 'Certificate of Good Moral Character', requirement_type: 'main', order_index: 3 },
  { id: 4, requirement_text: 'PSA Birth Certificate', requirement_type: 'main', order_index: 4 },
  {
    id: 5,
    requirement_text: 'Proof of Mandaluyong Residence (any ONE of the following):',
    requirement_type: 'main',
    order_index: 5,
    sub_requirements: [
      { id: 51, requirement_text: "Voter's ID of the applicant or their parents", requirement_type: 'sub', order_index: 1 },
      {
        id: 52,
        requirement_text:
          'Any government-issued ID of the student, parent/s, or legal guardian showing address in Mandaluyong City',
        requirement_type: 'sub',
        order_index: 2,
      },
      {
        id: 53,
        requirement_text: 'Proof of billing with Mandaluyong address named after the student or their parent/s or guardian',
        requirement_type: 'sub',
        order_index: 3,
      },
    ],
  },
  {
    id: 6,
    requirement_text:
      'Two (2) completely filled-out Recommendation Forms by former teacher/s or the School Principal, in a sealed envelope.',
    requirement_type: 'main',
    order_index: 6,
  },
  {
    id: 7,
    requirement_text: 'Original & photocopy of Certificate of Rating (ALS Completer/Passer only)',
    requirement_type: 'main',
    order_index: 7,
  },
  {
    id: 8,
    requirement_text:
      'Transcript of Records (TOR) with graduation date (For Associate, Certificate, Vocational, or Diploma Degree Holder)',
    requirement_type: 'main',
    order_index: 8,
  },
]

const DEFAULT_PROCEDURES: ProcedureItem[] = [
  {
    id: 1,
    step_number: 1,
    step_title: 'Fill out the pre-registration via Google Form',
    step_description: null,
    link_text: 'Pre-Register Form',
    link_url:
      'https://docs.google.com/forms/d/e/1FAIpQLSc1wetVpXWkg_4nUZQeWjlHGJ2zDxdXGrNcmJrGj0EXmUtadw/viewform',
    note_text: 'Failure to take the pre-registration form means invalid application.',
    note_type: 'error',
    order_index: 1,
  },
  {
    id: 2,
    step_number: 2,
    step_title: 'Submit required documents',
    step_description:
      "Submit required documents in person at the Registrar's Office (Ground Floor, Administrative Building) starting February 17, 2025",
    link_text: null,
    link_url: null,
    note_text: 'Only walk-ins with complete requirements will be accommodated. Submission hours: 8:00 AM – 4:00 PM (Mon-Fri)',
    note_type: 'warning',
    order_index: 2,
  },
  {
    id: 3,
    step_number: 3,
    step_title: 'All requirements will be assessed by the Admission Officer',
    step_description: 'Once complete, the student will be scheduled for the Entrance Examination.',
    link_text: null,
    link_url: null,
    note_text: null,
    note_type: 'info',
    order_index: 3,
  },
]

function getNoteColor(noteType: string | null) {
  switch (noteType) {
    case 'error':
      return 'text-red-600 dark:text-red-400'
    case 'warning':
      return 'text-orange-600 dark:text-orange-400'
    default:
      return 'text-gray-700 dark:text-gray-300'
  }
}

export default function DocumentaryRequirement({ items, procedures }: DocumentaryRequirementProps) {
  const displayItems = items && items.length > 0 ? items : DEFAULT_REQUIREMENTS
  const displayProcedures = procedures && procedures.length > 0 ? procedures : DEFAULT_PROCEDURES

  // Separate recommendation form item to render the link
  const RECOM_LINK = 'https://bit.ly/RecomForm2025'

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
              {displayItems.map((item) => (
                <li key={item.id}>
                  {item.sub_requirements && item.sub_requirements.length > 0 ? (
                    <div className="flex items-start gap-4">
                      <CheckCircle className="text-primary flex-shrink-0 mt-1" size={16} />
                      <div>
                        <p className="text-gray-700 dark:text-gray-300 mb-2">
                          {item.requirement_text}
                        </p>
                        <ul className="space-y-2 ml-4">
                          {item.sub_requirements.map((sub) => (
                            <li key={sub.id} className="flex items-center gap-3">
                              <CheckCircle className="text-primary flex-shrink-0" size={14} />
                              <span className="text-gray-700 dark:text-gray-300">
                                {sub.requirement_text}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : item.requirement_text.toLowerCase().includes('recommendation') ? (
                    <div className="flex items-start gap-4">
                      <CheckCircle className="text-primary flex-shrink-0 mt-1" size={16} />
                      <div>
                        <p className="text-gray-700 dark:text-gray-300 mb-1">
                          {item.requirement_text}
                        </p>
                        <p className="text-blue-600 dark:text-blue-400 underline">
                          Download from:{' '}
                          <a href={RECOM_LINK} target="_blank" rel="noopener noreferrer">
                            {RECOM_LINK}
                          </a>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <CheckCircle className="text-primary flex-shrink-0" size={16} />
                      <span className="text-gray-700 dark:text-gray-300">
                        {item.requirement_text}
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column - Image */}
          <div className="flex items-center justify-center">
            <div className="relative w-full aspect-video rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
              <Image src="/mcst-core.jpg" alt="MCST Event 1" fill className="object-cover" />
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
              {displayProcedures.map((step) => (
                <div key={step.id}>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    <span className="font-bold">
                      {step.step_number}. {step.step_title}
                      {step.step_description ? ':' : ''}
                    </span>
                    {step.step_description && (
                      <span> {step.step_description}</span>
                    )}
                  </p>
                  {step.link_url && step.link_text && (
                    <p className="text-blue-600 dark:text-blue-400 underline ml-4">
                      <a href={step.link_url} target="_blank" rel="noopener noreferrer">
                        {step.link_text}
                      </a>
                    </p>
                  )}
                  {step.note_text && (
                    <p className={`text-sm ml-4 mt-1 ${getNoteColor(step.note_type)}`}>
                      {step.note_type === 'error' || step.note_type === 'warning' ? 'Note: ' : ''}
                      {step.note_text}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="flex items-center justify-center">
            <div className="relative w-full aspect-video rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
              <Image src="/mcst-core2.jpg" alt="MCST Event 2" fill className="object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
