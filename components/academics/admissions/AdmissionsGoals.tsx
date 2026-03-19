import { BookOpen, TrendingUp, Users, Zap, Globe, type LucideIcon } from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  BookOpen,
  TrendingUp,
  Users,
  Zap,
  Globe,
}

interface GoalItem {
  id: number
  goal_text: string
  icon_name: string
  order_index: number
}

const DEFAULT_GOALS: GoalItem[] = [
  { id: 1, goal_text: 'Provide Mandaluyong access to quality higher education.', icon_name: 'BookOpen', order_index: 1 },
  {
    id: 2,
    goal_text:
      'Support optimum advancement in instruction, technology, research, innovation, and resource generation.',
    icon_name: 'TrendingUp',
    order_index: 2,
  },
  {
    id: 3,
    goal_text:
      'Collaborate with various educational, technical, and professional stakeholders for genuine public service.',
    icon_name: 'Users',
    order_index: 3,
  },
  {
    id: 4,
    goal_text:
      'Foster institutional effectiveness and efficiency for continuous improvement and total quality management.',
    icon_name: 'Zap',
    order_index: 4,
  },
  {
    id: 5,
    goal_text:
      'Produce graduates who are locally and internationally competent with a high sense of nationalism.',
    icon_name: 'Globe',
    order_index: 5,
  },
]

interface AdmissionsGoalsProps {
  goals?: GoalItem[]
}

export default function AdmissionsGoals({ goals }: AdmissionsGoalsProps) {
  const displayGoals = goals && goals.length > 0 ? goals : DEFAULT_GOALS

  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-900 dark:text-white text-center">
          Goals of Mandaluyong College of Science and Technology
        </h2>

        <div className="space-y-6">
          {displayGoals.map((goal) => {
            const Icon = ICON_MAP[goal.icon_name] ?? BookOpen
            return (
              <div
                key={goal.id}
                className="flex items-start gap-6 p-6 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
              >
                <Icon className="text-primary flex-shrink-0 mt-1" size={28} />
                <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg">
                  {goal.goal_text}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
