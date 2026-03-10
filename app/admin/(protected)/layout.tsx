'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import { decodeJwt } from 'jose'

interface AdminPayload {
  email?: string
  fullName?: string
  sub?: string | number
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [adminName, setAdminName] = useState('Admin')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      try {
        // Decode JWT to get admin info (without verification, as it's on client side)
        const decoded = decodeJwt(token) as unknown as AdminPayload
        setAdminName(decoded.fullName || decoded.email || 'Admin')
      } catch (error) {
        console.error('Failed to decode token:', error)
      }
    }
  }, [])

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - Hidden on mobile, visible on lg */}
      <div className="hidden lg:flex">
        <AdminSidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Sidebar mobile overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="relative z-50 h-screen">
            <AdminSidebar onClose={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader
          adminName={adminName}
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
