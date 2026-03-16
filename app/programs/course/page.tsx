import { Suspense } from 'react'
import RealtimeCourseDetailsWrapper from '@/components/academics/programs/course/RealtimeCourseDetailsWrapper'

export default function CoursePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-gray-900" />}>
      <RealtimeCourseDetailsWrapper />
    </Suspense>
  )
}
