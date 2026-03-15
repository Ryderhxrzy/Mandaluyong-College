import { ShieldCheck } from 'lucide-react'

export default function PrivacyHeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-slate-800 dark:to-slate-900 text-white py-16 md:py-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 dark:text-white">
              Your Privacy
            </h1>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-blue-100 dark:text-blue-300 -mt-4">
              Our Commitment
            </h1>
            <p className="text-lg md:text-xl text-blue-100 dark:text-blue-300">
              How we protect and use your information at Mandaluyong College of Science and Technology
            </p>
          </div>

          {/* Right Privacy Icon */}
          <div className="flex justify-center items-center">
            <ShieldCheck size={256} className="text-white opacity-90" />
          </div>
        </div>
      </div>
    </section>
  )
}
