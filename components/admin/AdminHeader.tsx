'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, X, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminHeader({
  adminName,
  onMenuToggle,
}: {
  adminName: string
  onMenuToggle: () => void
}) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/admin/logout`, { method: 'POST' })
      if (response.ok) {
        localStorage.removeItem('admin_token')
        toast.success('Logged out successfully')
        router.push('/admin/login')
      } else {
        toast.error('Failed to logout')
      }
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('An error occurred')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
        >
          <Menu size={24} className="text-gray-700 dark:text-gray-300" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Admin Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{adminName}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  )
}
