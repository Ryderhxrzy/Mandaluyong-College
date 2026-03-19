import { Suspense } from 'react'
import FaqQuestionsContent from './page-content'

export const dynamic = 'force-dynamic'

export default function FaqQuestionsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-900 dark:text-white font-medium italic animate-pulse">Loading FAQ Questions...</div>}>
      <FaqQuestionsContent />
    </Suspense>
  )
}
