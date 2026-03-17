import { Suspense } from 'react'
import BannerContent from './page-content'

export const dynamic = 'force-dynamic'

export default function BannerPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <BannerContent />
    </Suspense>
  )
}
