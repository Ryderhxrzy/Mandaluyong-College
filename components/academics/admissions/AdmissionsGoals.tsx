import { BookOpen, TrendingUp, Users, Zap, Globe } from 'lucide-react'

export default function AdmissionsGoals() {
  const goals = [
    {
      id: 1,
      icon: BookOpen,
      text: 'Provide Mandaluyong access to quality higher education.',
    },
    {
      id: 2,
      icon: TrendingUp,
      text: 'Support optimum advancement in instruction, technology, research, innovation, and resource generation.',
    },
    {
      id: 3,
      icon: Users,
      text: 'Collaborate with various educational, technical, and professional stakeholders for genuine public service.',
    },
    {
      id: 4,
      icon: Zap,
      text: 'Foster institutional effectiveness and efficiency for continuous improvement and total quality management.',
    },
    {
      id: 5,
      icon: Globe,
      text: 'Produce graduates who are locally and internationally competent with a high sense of nationalism.',
    },
  ]

  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: 'var(--section-bg-alt)' }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center" style={{ color: 'var(--text-heading)' }}>
          Goals of Mandaluyong College of Science and Technology
        </h2>

        <div className="space-y-6">
          {goals.map((goal) => {
            const Icon = goal.icon
            return (
              <div
                key={goal.id}
                className="flex items-start gap-6 p-6 rounded-lg"
                style={{
                  backgroundColor: 'var(--section-bg-light)',
                  borderColor: 'var(--border-light)',
                  borderWidth: '1px',
                }}
              >
                <Icon className="flex-shrink-0 mt-1" size={28} style={{ color: 'var(--primary-color)' }} />
                <p className="text-base md:text-lg" style={{ color: 'var(--text-body)' }}>
                  {goal.text}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
