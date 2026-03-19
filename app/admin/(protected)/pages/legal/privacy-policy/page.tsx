import { Suspense } from 'react'
import PrivacyPolicyContentAdmin from './page-content'

export const dynamic = 'force-dynamic'

export default function PrivacyPolicyAdminPage() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-900 dark:text-white font-medium italic animate-pulse">Loading Privacy Policy Content...</div>}>
      <PrivacyPolicyContentAdmin />
    </Suspense>
  )
}
