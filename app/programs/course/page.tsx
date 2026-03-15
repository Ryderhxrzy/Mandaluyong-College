'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import CourseDetails from '@/components/academics/programs/course/CourseDetails'
import { PROGRAM_DATA } from '@/components/academics/programs/course/courseData'

export default function CoursePage() {
  const searchParams = useSearchParams()
  const courseName = searchParams.get('name')

  // Convert the URL parameter format back to title format
  const decodedCourseName = courseName ? courseName.split('-').join(' ') : null

  // Find the matching program
  const program = PROGRAM_DATA.find(
    (p) => p.title.toLowerCase() === decodedCourseName?.toLowerCase()
  )

  if (!program) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-16 py-16">
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
          >
            <ArrowLeft size={20} />
            Back to Programs
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Program Not Found
            </h1>
            <p className="text-gray-700 dark:text-gray-400 mb-8">
              The program you're looking for doesn't exist.
            </p>
            <Link
              href="/programs"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              View All Programs
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <CourseDetails program={program} />
}
