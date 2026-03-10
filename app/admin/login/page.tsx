'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { useTheme } from 'next-themes'
import { lightToastOptions, darkToastOptions } from '@/lib/toast-config'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = theme === 'dark'

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate inputs
    if (!email || !password) {
      toast.error('Please fill in all fields')
      setIsLoading(false)
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    try {
      // TODO: Replace with your actual authentication API
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Login successful! Redirecting to dashboard...')
        // TODO: Handle successful login (redirect to dashboard)
        setTimeout(() => {
          window.location.href = '/admin/dashboard'
        }, 1500)
      } else {
        toast.error(data.message || 'Invalid email or password')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col bg-white dark:bg-[#0a0a0a] pb-16">
      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-2 pt-16">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <Image
                src="/mcst-logo.png"
                alt="MCST Logo"
                width={72}
                height={72}
                className="object-contain"
              />
            </div>

            {/* Header */}
            <div className="text-center mb-5">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                Admin Login
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Sign in to access the admin dashboard
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-[#003a7a] disabled:bg-gray-400 text-white font-semibold py-2.5 rounded-lg transition duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              <p>
                Don&apos;t have an account?{' '}
                <Link
                  href="/contact"
                  className="text-primary hover:text-[#003a7a] font-semibold transition"
                >
                  Contact us
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      {mounted && (
        <Toaster
          position="top-center"
          toastOptions={isDark ? darkToastOptions : lightToastOptions}
        />
      )}
    </div>
  )
}
