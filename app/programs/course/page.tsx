import { Suspense } from 'react'
import CoursePageClient from './CoursePageClient'

export default function CoursePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-gray-900" />}>
      <CoursePageClient />
    </Suspense>
  )
}
