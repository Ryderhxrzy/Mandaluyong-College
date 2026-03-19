import { Suspense } from 'react'
import CTAContent from './page-content'

export const dynamic = 'force-dynamic'

export default function AdmissionsCTAPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CTAContent />
    </Suspense>
  )
}
