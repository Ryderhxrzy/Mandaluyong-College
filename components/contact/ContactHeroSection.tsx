import Image from 'next/image'

export interface ContactHeroSectionProps {
  title?: string
  subtitle?: string
  logoImage?: string
}

export default function ContactHeroSection({
  title = "Let's Talk. Get in Touch with MCST",
  subtitle = 'Whether you are a student, parent, or guest, we are here to help.',
  logoImage = '/mcst-logo.png',
}: ContactHeroSectionProps) {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {title.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < title.split('\n').length - 1 && <br />}
                </span>
              ))}
            </h1>
            <p className="text-lg md:text-xl text-blue-100">
              {subtitle}
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
