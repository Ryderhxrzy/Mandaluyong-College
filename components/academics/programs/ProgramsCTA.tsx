import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function ProgramsCTA() {
  return (
    <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-16 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          Elevate Your Future With Mandaluyong College of Science and Technology
        </h2>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
          Whether you're aiming to innovate, lead, serve, or create—your journey starts here. Our
          programs are designed to not just prepare you for a job, but to shape you into a
          visionary ready to transform the world.
        </p>
        <Link
          href="/admissions"
          className="inline-flex items-center gap-2 bg-primary hover:bg-[#003a7a] text-white font-semibold px-8 py-3 rounded-lg transition-colors"
        >
          Start Your Journey
          <ArrowRight size={20} />
        </Link>
      </div>
    </section>
  )
}
