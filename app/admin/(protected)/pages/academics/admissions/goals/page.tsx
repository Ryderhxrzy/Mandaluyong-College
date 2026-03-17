import { Suspense } from 'react'
import GoalsContent from './page-content'

export const dynamic = 'force-dynamic'

export default function GoalsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <GoalsContent />
    </Suspense>
  )
}
