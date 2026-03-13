interface AboutBannerProps {
  backgroundImageUrl?: string
}

export default function AboutBanner({ backgroundImageUrl = '/banner.jpg' }: AboutBannerProps) {
  return (
    <section
      className="banner-section relative w-full h-[240px] sm:h-[300px] md:h-[600px] flex items-center justify-center overflow-hidden -mt-14 md:-mt-16"
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
