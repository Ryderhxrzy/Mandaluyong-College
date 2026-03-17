import { Suspense } from 'react'
import RequiredStrandContent from './page-content'

export const dynamic = 'force-dynamic'

export default function RequiredStrandPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <RequiredStrandContent />
    </Suspense>
  )
}
