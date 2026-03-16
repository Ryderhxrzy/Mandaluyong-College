import { Suspense } from 'react'
import CourseImagesPageContent from './images-content'

export const dynamic = 'force-dynamic'

export default function CourseImagesPage() {
  return (
    <Suspense fallback={<div className="p-6 w-full text-center text-gray-500 dark:text-gray-400">Loading...</div>}>
      <CourseImagesPageContent />
    </Suspense>
  )
}
