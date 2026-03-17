import { Suspense } from 'react'
import DocumentaryRequirementsContent from './page-content'

export const dynamic = 'force-dynamic'

export default function DocumentaryRequirementsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <DocumentaryRequirementsContent />
    </Suspense>
  )
}
