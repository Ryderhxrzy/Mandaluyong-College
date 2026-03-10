import Link from 'next/link'
import {
  LayoutDashboard,
  Home,
  Info,
  GraduationCap,
  Newspaper,
  HelpCircle,
  BookOpen,
  Mail,
  ArrowRight,
} from 'lucide-react'

const sections = [
  {
    label: 'Home Page',
    href: '/admin/pages/home',
    icon: Home,
    description: 'Manage hero section, overview, core values, and more',
    color: 'from-blue-500 to-blue-600',
  },
  {
    label: 'About',
    href: '/admin/pages/about',
    icon: Info,
    description: 'Edit the about page content',
    color: 'from-purple-500 to-purple-600',
  },
  {
    label: 'Academics',
    href: '/admin/pages/academics',
    icon: GraduationCap,
    description: 'Manage programs and admissions',
    color: 'from-green-500 to-green-600',
  },
  {
    label: 'News',
    href: '/admin/pages/news',
    icon: Newspaper,
    description: 'Manage news and announcements',
    color: 'from-orange-500 to-orange-600',
  },
  {
    label: 'FAQs',
    href: '/admin/pages/faqs',
    icon: HelpCircle,
    description: 'Manage frequently asked questions',
    color: 'from-pink-500 to-pink-600',
  },
  {
    label: 'Resources',
    href: '/admin/pages/resources',
    icon: BookOpen,
    description: "Manage registrar's office and learning resources",
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    label: 'Contact',
    href: '/admin/pages/contact',
    icon: Mail,
    description: 'Manage contact information',
    color: 'from-cyan-500 to-cyan-600',
  },
]

const stats = [
  {
    label: 'Total Pages',
    value: '7',
    description: 'Managed sections',
    icon: LayoutDashboard,
    color: 'from-blue-500 to-blue-600',
  },
  {
    label: 'Active Sections',
    value: '6',
    description: 'Published on site',
    icon: Home,
    color: 'from-green-500 to-green-600',
  },
  {
    label: 'Content Tables',
    value: '6',
    description: 'In database',
    icon: BookOpen,
    color: 'from-purple-500 to-purple-600',
  },
  {
    label: 'Admin Users',
    value: '1',
    description: 'Active admin',
    icon: Info,
    color: 'from-orange-500 to-orange-600',
  },
]

export default function AdminDashboard() {
  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your site content and settings
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition hover:shadow-lg"
            >
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${stat.color} mb-4`}>
                <Icon className="text-white" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
                {stat.label}
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-xs">{stat.description}</p>
            </div>
          )
        })}
      </div>

      {/* Pages Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Manage Content
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <Link
                key={section.href}
                href={section.href}
                className="group relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition hover:shadow-lg hover:border-primary dark:hover:border-primary overflow-hidden"
              >
                <div
                  className={`absolute top-0 right-0 w-24 h-24 opacity-10 -mr-6 -mt-6 rounded-full bg-gradient-to-br ${section.color} group-hover:scale-110 transition-transform`}
                />
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${section.color} mb-4`}>
                  <Icon className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 relative z-10">
                  {section.label}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 relative z-10">
                  {section.description}
                </p>
                <div className="flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform relative z-10">
                  <span>Manage</span>
                  <ArrowRight size={16} className="ml-2" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
