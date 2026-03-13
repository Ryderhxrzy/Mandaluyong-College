import AboutBanner from '@/components/about/AboutBanner'
import AboutKeyStatistics from '@/components/about/AboutKeyStatistics'
import AboutGoalsPhilosophy from '@/components/about/AboutGoalsPhilosophy'
import AboutMissionVision from '@/components/about/AboutMissionVision'
import AboutCoreValuesSection from '@/components/about/AboutCoreValuesSection'
import AboutWhyChoose from '@/components/about/AboutWhyChoose'
import AboutJoinCommunity from '@/components/about/AboutJoinCommunity'

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <AboutBanner />
      <AboutKeyStatistics />
      <AboutGoalsPhilosophy />
      <AboutMissionVision />
      <AboutCoreValuesSection />
      <AboutWhyChoose />
      <AboutJoinCommunity />
    </div>
  )
}
