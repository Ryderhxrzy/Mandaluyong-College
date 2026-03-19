import { Suspense } from 'react'
import AnnouncementsContent from './page-content'

export const dynamic = 'force-dynamic'

export default function AnnouncementsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <AnnouncementsContent />
    </Suspense>
  )
}
