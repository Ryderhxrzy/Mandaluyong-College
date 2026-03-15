import FaqsHeroSection from '@/components/faqs/FaqsHeroSection'
import Faqs from '@/components/faqs/Faqs'

export default function RealtimeFaqsWrapper() {
  return (
    <div className="min-h-screen bg-white">
      <div className="-mt-14 md:-mt-16">
        <FaqsHeroSection />
      </div>
      <Faqs />
    </div>
  )
}
