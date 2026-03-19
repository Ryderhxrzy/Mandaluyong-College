import { Suspense } from 'react'
import PrivacyHeroContent from './page-content'

export const dynamic = 'force-dynamic'

export default function PrivacyHeroPage() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-900 dark:text-white font-medium">Loading Privacy Hero Settings...</div>}>
      <PrivacyHeroContent />
    </Suspense>
  )
}
