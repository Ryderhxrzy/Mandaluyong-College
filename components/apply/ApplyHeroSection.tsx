import Image from 'next/image'

export interface ApplyHeroSectionProps {
  title?: string
  subtitle?: string
  description?: string
  logoImage?: string
}

export default function ApplyHeroSection({
  title = 'Begin Your Future',
  subtitle = 'At Mandaluyong College of Science and Technology',
  description = 'Unlock your potential with world-class programs tailored for new applicants and transferees. Join a thriving academic community that fosters innovation, leadership, and excellence.',
  logoImage = '/mcst-logo.png',
}: ApplyHeroSectionProps) {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-6 font-medium">
              {subtitle}
            </p>
            <p className="text-base md:text-lg text-blue-50 leading-relaxed max-w-xl">
              {description}
            </p>
          </div>

          {/* Right Logo */}
          <div className="flex justify-center items-center">
            <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 opacity-90">
              {logoImage && (
                <Image
                  src={logoImage}
                  alt="MCST Logo"
                  fill
                  className="object-contain"
                  priority
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
