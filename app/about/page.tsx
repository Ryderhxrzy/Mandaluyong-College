import AboutBanner from '@/components/AboutBanner'
import AboutKeyStatistics from '@/components/AboutKeyStatistics'
import AboutGoalsPhilosophy from '@/components/AboutGoalsPhilosophy'
import AboutMissionVision from '@/components/AboutMissionVision'
import AboutCoreValuesSection from '@/components/AboutCoreValuesSection'
import AboutWhyChoose from '@/components/AboutWhyChoose'
import AboutJoinCommunity from '@/components/AboutJoinCommunity'

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
