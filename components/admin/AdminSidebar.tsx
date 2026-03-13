'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import Image from 'next/image'
import {
  LayoutDashboard,
  Home,
  Info,
  GraduationCap,
  Newspaper,
  HelpCircle,
  BookOpen,
  Mail,
  ChevronDown,
  Sun,
  Moon,
  Zap,
  Building2,
  Heart,
  Lightbulb,
  Briefcase,
  FileText,
  Clipboard,
  Library,
  X,
  Award,
  Users,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  children?: NavItem[]
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Home Page',
    href: '/admin/pages/home',
    icon: Home,
    children: [
      { label: 'Hero Section', href: '/admin/pages/home/hero', icon: Zap },
      { label: 'Institutional Overview', href: '/admin/pages/home/overview', icon: Building2 },
      { label: 'Core Values', href: '/admin/pages/home/core-values', icon: Heart },
      { label: 'Education Commitment', href: '/admin/pages/home/quality-education', icon: Lightbulb },
      { label: 'Academic Programs', href: '/admin/pages/home/academic-programs', icon: GraduationCap },
      { label: 'CTA Section', href: '/admin/pages/home/cta', icon: Mail },
    ],
  },
  {
    label: 'About',
    href: '/admin/pages/about',
    icon: Info,
    children: [
      { label: 'Banner', href: '/admin/pages/about/banner', icon: Zap },
      { label: 'Key Statistics', href: '/admin/pages/about/statistics', icon: Building2 },
      { label: 'Goals & Philosophy', href: '/admin/pages/about/goals', icon: Lightbulb },
      { label: 'Mission & Vision', href: '/admin/pages/about/mission', icon: Briefcase },
      { label: 'Core Values', href: '/admin/pages/about/core-values', icon: Heart },
      { label: 'Why Choose MCST', href: '/admin/pages/about/why-choose', icon: Award },
      { label: 'Join MCST Community', href: '/admin/pages/about/join-community', icon: Users },
    ],
  },
  {
    label: 'Academics',
    href: '/admin/pages/academics',
    icon: GraduationCap,
    children: [
      { label: 'Programs', href: '/admin/pages/academics/programs', icon: Briefcase },
      { label: 'Admissions', href: '/admin/pages/academics/admissions', icon: FileText },
    ],
  },
  {
    label: 'News',
    href: '/admin/pages/news',
    icon: Newspaper,
  },
  {
    label: 'FAQs',
    href: '/admin/pages/faqs',
    icon: HelpCircle,
  },
  {
    label: 'Resources',
    href: '/admin/pages/resources',
    icon: BookOpen,
    children: [
      { label: "Registrar's Office", href: '/admin/pages/resources/registrar', icon: Clipboard },
      { label: 'Learning Resource Center', href: '/admin/pages/resources/lrc', icon: Library },
    ],
  },
  {
    label: 'Contact',
    href: '/admin/pages/contact',
    icon: Mail,
  },
]

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Auto-expand dropdowns with active children
  useEffect(() => {
    setMounted(true)
    const newExpanded = new Set<string>()
    navItems.forEach((item) => {
      if (item.children && item.children.some((child) => pathname.startsWith(child.href))) {
        newExpanded.add(item.href)
      }
    })
    setExpandedGroups(newExpanded)
  }, [pathname])

  const toggleDropdown = (href: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(href)) {
        newSet.delete(href)
      } else {
        newSet.add(href)
      }
      return newSet
    })
  }

  const isActive = (href: string) => pathname === href
  const isGroupActive = (href: string) => pathname.startsWith(href)

  return (
    <nav className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen">
      {/* Header Section - Same height as admin header (px-6 py-4) */}
      <div className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/mcst-logo.png"
            alt="MCST Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="font-semibold text-gray-900 dark:text-white text-sm">MCST</span>
        </div>
        <div className="flex items-center gap-2">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun size={18} className="text-yellow-500" />
              ) : (
                <Moon size={18} className="text-gray-600" />
              )}
            </button>
          )}
          {/* Close button on mobile */}
          <button
            onClick={onClose}
            className="p-2 lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition cursor-pointer"
            aria-label="Close sidebar"
          >
            <X size={18} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-1 px-3 py-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <div
                className={`flex items-center justify-between rounded-md transition px-3 py-2 cursor-pointer ${
                  isActive(item.href)
                    ? 'bg-primary text-white'
                    : isGroupActive(item.href)
                      ? 'bg-primary/10 text-primary dark:bg-primary/20'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {item.children ? (
                  <button
                    onClick={() => toggleDropdown(item.href)}
                    className="flex items-center gap-3 text-sm font-medium w-full cursor-pointer"
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 text-sm font-medium w-full"
                    onClick={onClose}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                )}

                {item.children && (
                  <ChevronDown
                    size={16}
                    className={`transition-transform text-gray-400 flex-shrink-0 ${
                      expandedGroups.has(item.href) ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </div>

              {item.children && expandedGroups.has(item.href) && (
                <ul className="ml-3 mt-1 space-y-1 border-l border-gray-200 dark:border-gray-700 pl-4">
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition ${
                          isActive(child.href)
                            ? 'bg-primary text-white'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        onClick={onClose}
                      >
                        <child.icon size={14} />
                        <span>{child.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
