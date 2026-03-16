import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface CourseDetailsBannerProps {
  backgroundImageUrl?: string
  courseName?: string
}

export default function CourseDetailsBanner({
  backgroundImageUrl = '/campus.png',
  courseName = 'Course Name',
}: CourseDetailsBannerProps) {
  return (
    <section
      className="banner-section relative w-full h-[240px] sm:h-[300px] md:h-[600px] flex flex-col items-center justify-center overflow-hidden -mt-14 md:-mt-16"
      style={{
        backgroundImage: `url('${backgroundImageUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'scroll',
      }}
    >
      {/* Opacity Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Text Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center gap-6">
        {/* Back Button */}
        <Link
          href="/programs"
          className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity self-start md:self-center"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </Link>

        <div className="flex flex-col gap-4">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold">CAMPUS GALLERY</h1>
          <p className="text-lg sm:text-xl md:text-2xl">{courseName}</p>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .banner-section {
            background-position: center 20% !important;
          }
        }
      `}</style>
    </section>
  )
}
