import { Suspense } from 'react'
import TermsAndConditionsContentAdmin from './page-content'

export const dynamic = 'force-dynamic'

export default function TermsAndConditionsAdminPage() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-900 dark:text-white font-medium italic animate-pulse">Loading Terms Content...</div>}>
      <TermsAndConditionsContentAdmin />
    </Suspense>
  )
}
