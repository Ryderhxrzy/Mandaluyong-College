import { Suspense } from 'react'
import CareersPageContent from './careers-content'

export const dynamic = 'force-dynamic'

export default function CareersPage() {
  return (
    <Suspense fallback={<div className="p-6 w-full text-center text-gray-500 dark:text-gray-400">Loading...</div>}>
      <CareersPageContent />
    </Suspense>
  )
}
