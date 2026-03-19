import { Suspense } from 'react'
import TermsHeroContent from './page-content'

export const dynamic = 'force-dynamic'

export default function TermsHeroPage() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-900 dark:text-white font-medium italic">Loading Terms & Conditions Settings...</div>}>
      <TermsHeroContent />
    </Suspense>
  )
}
