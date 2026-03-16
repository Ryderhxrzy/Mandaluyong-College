import { Suspense } from 'react'
import CurriculumPageContent from './curriculum-content'

export const dynamic = 'force-dynamic'

export default function CurriculumPage() {
  return (
    <Suspense fallback={<div className="p-6 w-full text-center text-gray-500 dark:text-gray-400">Loading...</div>}>
      <CurriculumPageContent />
    </Suspense>
  )
}
