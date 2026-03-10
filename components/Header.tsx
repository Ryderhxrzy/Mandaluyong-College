'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X, ChevronDown, Mail, Sun, Moon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'

function ThemeToggle({ isScrolled }: { isScrolled: boolean }) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-9 h-9" />
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className={`p-2 rounded-full cursor-pointer transition-colors duration-300 flex items-center justify-center relative w-9 h-9 ${isScrolled
        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
        : 'bg-white/10 text-white hover:bg-white/20'
        }`}
      aria-label="Toggle Dark Mode"
    >
      <Sun size={18} className="absolute scale-0 transition-all dark:scale-100" />
      <Moon size={18} className="scale-100 transition-all dark:scale-0" />
    </button>
  )
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Academics', href: '/academics', hasDropdown: true },
    { label: 'News', href: '/news' },
    { label: 'FAQs', href: '/faqs' },
    { label: 'Resources', href: '/resources', hasDropdown: true },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isSolid = isScrolled || pathname !== '/'

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isSolid
        ? 'bg-white shadow-md dark:bg-slate-900 dark:border-b dark:border-slate-800'
        : 'bg-transparent'
        }`}
    >
      <nav className="max-w-[1400px] mx-auto w-full px-8 md:px-16 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 relative flex-shrink-0">
            <Image
              src="/mcst-logo.png"
              alt="MCST Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <span
            className={`font-bold text-xl transition-colors duration-300 ${isSolid ? 'text-gray-900 dark:text-white' : 'text-white'
              }`}
          >
            MCST
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex gap-6 lg:gap-8 items-center">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-semibold text-sm lg:text-base flex items-center gap-1 transition-colors duration-300 ${isActive
                  ? 'text-[#50a2ff]'
                  : isSolid
                    ? 'text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary'
                    : 'text-white hover:text-gray-200'
                  }`}
              >
                {link.label}
                {link.hasDropdown && <ChevronDown size={14} />}
              </Link>
            )
          })}

          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className={`font-medium text-sm lg:text-base px-3 py-1.5 rounded-md transition-colors duration-300 flex items-center gap-2 ${isSolid
                ? 'bg-primary text-white hover:bg-[#003a7a] dark:bg-primary dark:hover:bg-[#003a7a]'
                : 'bg-white text-primary hover:bg-gray-100'
                }`}
            >
              <Mail size={16} /> Contact Us
            </Link>
            <ThemeToggle isScrolled={isSolid} />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`transition-colors duration-300 ${isSolid ? 'text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary' : 'text-white hover:text-gray-200'
              }`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <ThemeToggle isScrolled={isSolid} />
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={`lg:hidden border-t ${isSolid ? 'bg-gray-50 border-gray-200 dark:bg-slate-900 dark:border-slate-800' : 'bg-black/95 border-gray-800'}`}>
          <div className="w-full px-8 md:px-16 py-4 flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-semibold transition-colors duration-300 flex justify-between items-center ${isActive
                    ? 'text-[#50a2ff]'
                    : isSolid
                      ? 'text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary'
                      : 'text-white hover:text-gray-300'
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown size={16} />}
                </Link>
              )
            })}
            <Link
              href="/contact"
              className={`font-medium py-2 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 ${isSolid
                ? 'bg-primary text-white hover:bg-[#003a7a] dark:bg-primary dark:hover:bg-[#003a7a]'
                : 'bg-white text-primary hover:bg-gray-100'
                }`}
              onClick={() => setIsOpen(false)}
            >
              <Mail size={18} /> Contact Us
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}


