'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface HeroProps {
  title: string
  subtitle: string
  description: string
  background_image_url: string
  className?: string
  containerClassName?: string
  asPreview?: boolean
  small?: boolean
}

export default function Hero({
  title,
  subtitle,
  description,
  background_image_url,
  className = "",
  containerClassName = "",
  asPreview = false,
  small = false
}: HeroProps) {
  
  const titleClasses = small 
    ? "text-xs sm:text-sm md:text-base font-extrabold mb-2 leading-tight tracking-tight"
    : "text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold mb-4 sm:mb-6 leading-tight tracking-tight";
  
  const titleSpanClasses = small 
    ? "text-white block mb-1 text-xs sm:text-sm"
    : "text-white block mb-1 sm:mb-2";
    
  const subtitleSpanClasses = small 
    ? "block text-xs sm:text-sm"
    : "block";

  const descriptionClasses = small
    ? "text-xs text-white leading-relaxed font-normal max-w-2xl mb-2"
    : "text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-10 text-white max-w-4xl leading-relaxed font-medium";

  const buttonGroupClasses = `flex flex-row ${small ? "gap-1 sm:gap-2" : "gap-2 sm:gap-4"}`;
  
  const buttonBaseClasses = "rounded-md font-medium transition flex items-center justify-center whitespace-nowrap cursor-pointer";
  
  const buttonClasses = small
    ? `${buttonBaseClasses} px-2 sm:px-3 py-1 text-xs gap-1`
    : `${buttonBaseClasses} px-4 sm:px-8 py-2 sm:py-3 text-xs sm:text-sm md:text-base gap-1 sm:gap-2`;

  const primaryButtonClasses = `${buttonClasses} bg-primary text-white border border-primary hover:bg-[#003a7a]`;
  const secondaryButtonClasses = `${buttonClasses} border border-white text-white hover:bg-white/10`;

  const arrowSize = small ? 12 : 16;

  return (
    <section
      className={`relative w-full flex items-center text-white overflow-hidden ${className}`}
      style={{
        backgroundImage: background_image_url ? `url(${background_image_url})` : undefined,
        backgroundSize: small ? 'cover' : '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: small ? 'scroll' : 'fixed',
      }}
    >
      {/* Overlay - Darker */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Hero Section Content */}
      <div className={`relative z-10 w-full max-w-[1400px] mx-auto ${containerClassName}`}>
        <h1 className={titleClasses}>
          <span className={titleSpanClasses}>{title}</span>
          <span style={{ color: '#50a2ff' }} className={subtitleSpanClasses}>
            {subtitle}
          </span>
        </h1>
        <p className={descriptionClasses}>
          {description}
        </p>
        <div className={buttonGroupClasses}>
          {asPreview ? (
            <>
              <button className={primaryButtonClasses}>
                Apply Now <ArrowRight size={arrowSize} />
              </button>
              <button className={secondaryButtonClasses}>
                Explore Programs
              </button>
            </>
          ) : (
            <>
              <Link href="/admissions" className={primaryButtonClasses}>
                Apply Now <ArrowRight size={arrowSize} />
              </Link>
              <Link href="/academics" className={secondaryButtonClasses}>
                Explore Programs
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
