'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PublicLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminPath = pathname.startsWith('/admin')

  return (
    <div className={isAdminPath ? '' : 'pt-14 md:pt-16'}>
      {!isAdminPath && <Header />}
      {children}
      {!isAdminPath && <Footer />}
    </div>
  )
}
