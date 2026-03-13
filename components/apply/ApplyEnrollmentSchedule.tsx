import EnrollmentScheduleTable from './EnrollmentScheduleTable'

export interface ScheduleItem {
  id: string
  date: string
  time: string
  yearLevel: string
  section: string
}

export interface ApplyEnrollmentScheduleProps {
  title?: string
  subtitle?: string
  items?: ScheduleItem[]
}

export default function ApplyEnrollmentSchedule({
  title = 'Enrollment Schedule',
  subtitle = 'A.Y. 2025–2026 (1st Semester)',
  items = [],
}: ApplyEnrollmentScheduleProps) {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {title}
          </h2>
          <p className="text-lg text-gray-600">
            {subtitle}
          </p>
        </div>

        <EnrollmentScheduleTable items={items} />
      </div>
    </section>
  )
}
