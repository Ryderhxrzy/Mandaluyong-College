import { Suspense } from 'react'
import CTAContent from './page-content'

export const dynamic = 'force-dynamic'

export default function CTAPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <CTAContent />
    </Suspense>
  )
}
