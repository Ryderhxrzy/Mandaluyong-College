import { Suspense } from 'react'
import FaqsHeroContent from './page-content'

export const dynamic = 'force-dynamic'

export default function FaqsHeroPage() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-900 dark:text-white">Loading...</div>}>
      <FaqsHeroContent />
    </Suspense>
  )
}
