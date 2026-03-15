import Image from 'next/image'

interface TermsHeroSectionProps {
  logoImage?: string
}

export default function TermsHeroSection({
  logoImage = '/mcst-logo.png',
}: TermsHeroSectionProps) {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Terms & Conditions
            </h1>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-100 -mt-4">
              Your Rights and Obligations
            </h1>
            <p className="text-lg md:text-xl text-blue-100">
              Know what you're agreeing to when using Mandaluyong College of Science and Technology platforms.
            </p>
          </div>

          {/* Right Logo */}
          <div className="flex justify-center items-center">
            <div className="relative w-48 h-48 md:w-64 md:h-64">
              <Image
                src={logoImage}
                alt="MCST Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
