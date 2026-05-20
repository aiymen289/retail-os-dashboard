'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Lock } from 'lucide-react'
import ConfigForm from '@/components/admin/config-form'
import { useAdminAuth } from '@/hooks/useAdminAuth'

export default function AdminPage() {
  const router = useRouter()
  const { isAuthenticated, login, logout } = useAdminAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (login(username, password)) {
      setUsername('')
      setPassword('')
    } else {
      setError('Invalid credentials. Demo: admin / retail123')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Lock className="text-blue-600" size={28} />
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Demo credentials: <br />
            <span className="font-medium">admin</span> / <span className="font-medium">retail123</span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={() => {
              logout()
              router.push('/')
            }}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="px-6 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-lg bg-white p-8 shadow">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">Configuration Manager</h2>
              <p className="mt-1 text-sm text-gray-600">
                Manage all business rules and thresholds. Changes take effect immediately.
              </p>
            </div>

            <ConfigForm
              onSuccess={() => {
                // Optionally navigate back to dashboard
                setTimeout(() => {
                  router.push('/')
                }, 2000)
              }}
            />
          </div>

          {/* Information Section */}
          <div className="mt-6 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4">
            <h3 className="font-semibold text-blue-900">How It Works</h3>
            <ul className="mt-2 space-y-1 text-sm text-blue-800">
              <li>• <strong>Expiring Soon:</strong> Items expiring within the threshold days</li>
              <li>• <strong>Stockout Risk:</strong> Items with low days of coverage</li>
              <li>• <strong>High Stock:</strong> Items with excess inventory</li>
              <li>• <strong>Elasticity:</strong> Controls how aggressive markdown suggestions are</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
