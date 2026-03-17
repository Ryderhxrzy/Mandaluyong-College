import { Suspense } from 'react'
import QualificationsContent from './page-content'

export const dynamic = 'force-dynamic'

export default function QualificationsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <QualificationsContent />
    </Suspense>
  )
}
