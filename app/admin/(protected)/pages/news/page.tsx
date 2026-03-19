import Link from 'next/link'
import { Newspaper, Zap, Clipboard, Mail } from 'lucide-react'

export default function NewsPage() {
  const sections = [
    {
      title: 'News Banner',
      description: 'Update the main banner image at the top of the news page.',
      href: '/admin/pages/news/banner',
      icon: Zap,
    },
    {
      title: 'Latest Announcements',
      description: 'Manage individual announcement cards and their redirect links.',
      href: '/admin/pages/news/announcements',
      icon: Clipboard,
    },
    {
       title: 'CTA Section',
       description: 'Edit the call-to-action text and manage the side images.',
       href: '/admin/pages/news/cta',
       icon: Mail,
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-outfit">News Page Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Select a section below to manage its content.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <Link 
              key={section.href} 
              href={section.href}
              className="group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-primary/50 transition-all hover:shadow-md cursor-pointer block"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors mb-4">
                <section.icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 font-outfit">{section.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{section.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
