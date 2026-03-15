'use client'

import ProgramsBanner from '@/components/academics/programs/ProgramsBanner'
import FeaturedPrograms from '@/components/academics/programs/FeaturedPrograms'
import ProgramsCTA from '@/components/academics/programs/ProgramsCTA'

interface RealtimeProgramWrapperProps {
  bannerImageUrl?: string
  title?: string
  subtitle?: string
}

export default function RealtimeProgramWrapper({
  bannerImageUrl = '/banner.jpg',
  title = 'Our Featured Programs',
  subtitle = 'Discover academic paths tailored for your success.',
}: RealtimeProgramWrapperProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <ProgramsBanner backgroundImageUrl={bannerImageUrl} />
      <FeaturedPrograms title={title} subtitle={subtitle} />
      <ProgramsCTA />
    </div>
  )
}
