'use client'

import React from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Layout, 
  Users, 
  FileText, 
  ListOrdered, 
  Target, 
  MessageSquare,
  ChevronRight,
  Monitor
} from 'lucide-react'

const ADMISSIONS_SECTIONS = [
  {
    title: 'Banner Section',
    description: 'Manage the top banner image of the admissions page.',
    href: '/admin/pages/academics/admissions/banner',
    icon: Layout,
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-900/20'
  },
  {
    title: 'Qualifications',
    description: 'Update the list of student qualifications required for admission.',
    href: '/admin/pages/academics/admissions/qualifications',
    icon: Users,
    color: 'text-green-600',
    bg: 'bg-green-50 dark:bg-green-900/20'
  },
  {
    title: 'Required Strand',
    description: 'Set which strands are required for each academic program.',
    href: '/admin/pages/academics/admissions/required-strand',
    icon: ListOrdered,
    color: 'text-amber-600',
    bg: 'bg-amber-50 dark:bg-amber-900/20'
  },
  {
    title: 'Documentary Requirements',
    description: 'Manage the documents students need to submit.',
    href: '/admin/pages/academics/admissions/documentary-requirements',
    icon: FileText,
    color: 'text-rose-600',
    bg: 'bg-rose-50 dark:bg-rose-900/20'
  },
  {
    title: 'Admission Procedures',
    description: 'Step-by-step instructions for the registration process.',
    href: '/admin/pages/academics/admissions/procedures',
    icon: MessageSquare,
    color: 'text-purple-600',
    bg: 'bg-purple-50 dark:bg-purple-900/20'
  },
  {
    title: 'Admission Goals',
    description: 'Define the mission and goals of the admissions office.',
    href: '/admin/pages/academics/admissions/goals',
    icon: Target,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50 dark:bg-cyan-900/20'
  },
  {
    title: 'Admissions CTA',
    description: 'Customize the final call-to-action and image gallery.',
    href: '/admin/pages/academics/admissions/cta',
    icon: Monitor,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20'
  }
]

export default function AdmissionsDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <Link 
            href="/admin/pages/academics" 
            className="flex items-center gap-2 text-primary hover:underline transition mb-4"
          >
            <ArrowLeft size={18} />
            Back to Academics
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Admissions Management</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Customize every section of your public admissions page in real-time.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ADMISSIONS_SECTIONS.map((section) => (
            <Link 
              key={section.href} 
              href={section.href}
              className="group block bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-primary transition-all hover:shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl ${section.bg} ${section.color} transition-transform group-hover:scale-110 duration-300`}>
                    <section.icon size={26} />
                  </div>
                  <ChevronRight className="text-gray-300 group-hover:text-primary transition-colors" />
                </div>
                <div className="mt-6 space-y-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {section.description}
                  </p>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-xs font-semibold text-primary">
                Manage Section <ChevronRight size={12} />
              </div>
            </Link>
          ))}
        </div>

        {/* Live Link Button */}
        <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-8 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">View Live Page</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl">
              Check how your changes look on the public Admissions page. All updates are applied instantly via Supabase Realtime.
            </p>
          </div>
          <Link 
            href="/admissions" 
            target="_blank"
            className="px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-opacity-90 shadow-lg shadow-primary/20 transition active:scale-95"
          >
            Go to Public Page
          </Link>
        </div>
      </div>
    </div>
  )
}
