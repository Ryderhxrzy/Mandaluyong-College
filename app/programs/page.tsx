import ProgramsBanner from '@/components/academics/programs/ProgramsBanner'
import FeaturedPrograms from '@/components/academics/programs/FeaturedPrograms'

export default function Academics() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <ProgramsBanner backgroundImageUrl="/banner.jpg" />
      <FeaturedPrograms />
    </div>
  )
}
