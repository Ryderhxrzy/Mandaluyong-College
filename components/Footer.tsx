import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-400">
      {/* Main Footer */}
      <div className="w-full max-w-[1400px] mx-auto px-8 md:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Logo & Description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 relative">
                <Image
                  src="/mcst-logo.png"
                  alt="MCST Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="text-gray-900 dark:text-white font-bold text-base">MCST</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              Mandaluyong College of Science and Technology – Empowering future leaders
              through quality education, research, and innovation.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold text-base mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/admissions" className="text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                  Apply
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/academics" className="text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                  Programs
                </Link>
              </li>
              <li>
                <Link href="/admissions" className="text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                  Admissions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Student Resources */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold text-base mb-6">Student Resources</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                  Student Life
                </a>
              </li>
              <li>
                <Link href="/faqs" className="text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                  News
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold text-base mb-6">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin size={18} className="flex-shrink-0 text-gray-600 dark:text-gray-400 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-400">
                  Welfareville Compound, Barangay Addition Hills, Mandaluyong City 1550
                </span>
              </li>
              <li className="flex gap-3">
                <Phone size={18} className="flex-shrink-0 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-400">(02) 87160352</span>
              </li>
              <li className="flex gap-3">
                <Mail size={18} className="flex-shrink-0 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-400">registrarsoffice@mcst.edu.ph</span>
              </li>
              <li className="flex gap-4 pt-2">
                <a href="#" className="text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                  <Facebook size={18} />
                </a>
                <a href="#" className="text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                  <Twitter size={18} />
                </a>
                <a href="#" className="text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                  <Linkedin size={18} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 dark:border-slate-700 my-8"></div>

        {/* Bottom */}
        <div className="flex flex-col justify-center items-center gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-500">&copy; 2026 MCST. All rights reserved.</p>
          <div className="flex flex-col sm:flex-row justify-center items-center text-sm gap-2">
            <Link href="#" className="text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition">
              Privacy Policy
            </Link>
            <span className="text-gray-400 dark:text-gray-600 hidden sm:inline">|</span>
            <Link href="#" className="text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
