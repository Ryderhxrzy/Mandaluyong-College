import * as LucideIcons from 'lucide-react'

interface TermsHeroProps {
  title?: string
  subtitle?: string
  description?: string
  icon?: string
}

export default function TermsHeroSection({
  title = 'Terms & Conditions',
  subtitle = 'Your Rights and Obligations',
  description = 'Know what you\'re agreeing to when using Mandaluyong College of Science and Technology platforms.',
  icon = 'Handshake',
}: TermsHeroProps) {
  // Get the Lucide icon component, fallback to Handshake
  const IconComponent = (LucideIcons as any)[icon] || LucideIcons.Handshake

  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-slate-800 dark:to-slate-900 text-white py-16 md:py-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 dark:text-white">
              {title}
            </h1>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-blue-100 dark:text-blue-300 -mt-4">
              {subtitle}
            </h1>
            <p className="text-lg md:text-xl text-blue-100 dark:text-blue-300">
              {description}
            </p>
          </div>

          {/* Right Icon */}
          <div className="flex justify-center items-center">
            <IconComponent size={256} className="text-white opacity-90" />
          </div>
        </div>
      </div>
    </section>
  )
}


