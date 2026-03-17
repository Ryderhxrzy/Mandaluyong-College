import { Suspense } from 'react'
import ProceduresContent from './page-content'

export const dynamic = 'force-dynamic'

export default function ProceduresPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <ProceduresContent />
    </Suspense>
  )
}
