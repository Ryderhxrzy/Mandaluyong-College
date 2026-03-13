import { CheckCircle } from 'lucide-react'

export interface RequirementItem {
  id: string | number
  description: string
}

export interface ProcedureStep {
  id: string | number
  stepNumber: number
  description: string
}

export interface ApplyRequirementsAndProcedureProps {
  title?: string
  enrollmentPeriod?: string
  enrollmentDates?: string
  requirements?: RequirementItem[]
  procedures?: ProcedureStep[]
  compact?: boolean
}

export default function ApplyRequirementsAndProcedure({
  title = 'Enrollment Procedure (Continuing Students)',
  enrollmentPeriod = 'A.Y. 2025–2026 (1st Semester)',
  enrollmentDates = 'June 16–20, 2025',
  requirements = [],
  procedures = [],
  compact = false,
}: ApplyRequirementsAndProcedureProps) {
  const content = (
    <>
      {/* Page Title */}
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-8">
        {title}
      </h2>

      {/* Enrollment Period and Dates */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2 text-primary">
          {enrollmentPeriod}
        </h3>
        <p className="text-gray-700 font-semibold">{enrollmentDates}</p>
      </div>

      {/* Requirements Section */}
      <div className="mb-8">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
          Requirements
        </h3>
        <ul className="space-y-3">
          {requirements.map((item) => (
            <li key={item.id} className="flex items-start gap-3">
              <CheckCircle className="flex-shrink-0 mt-1 text-primary" size={15} />
              <span className="text-gray-700">{item.description}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Enrollment Procedure Section */}
      <div className="mb-8">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
          Enrollment Procedure
        </h3>
        <ol className="space-y-3">
          {procedures.map((step) => (
            <li key={step.id} className="flex items-start gap-3">
              <span className="font-bold flex-shrink-0 text-primary">{step.stepNumber}.</span>
              <span className="text-gray-700">{step.description}</span>
            </li>
          ))}
        </ol>
      </div>
    </>
  )

  if (compact) {
    return content
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16">
        <div className="border border-gray-200 rounded-lg p-8 bg-white">
          {content}
        </div>
      </div>
    </section>
  )
}
