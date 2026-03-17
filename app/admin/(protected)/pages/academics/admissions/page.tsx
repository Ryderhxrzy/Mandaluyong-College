import { Suspense } from 'react'
import QualificationsContent from './qualifications/page-content'

export const dynamic = 'force-dynamic'

export default function QualificationsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QualificationsContent />
    </Suspense>
  )
}
