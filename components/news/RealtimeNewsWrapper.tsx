import NewsBanner from '@/components/news/NewsBanner'
import LatestAnnouncements from '@/components/news/LatestAnnouncements'
import NewsCTA from '@/components/news/NewsCTA'

export default function RealtimeNewsWrapper() {
  return (
    <>
      <NewsBanner />
      <LatestAnnouncements />
      <NewsCTA />
    </>
  )
}
