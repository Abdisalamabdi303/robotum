'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [session, setSession] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Wait for Supabase to pick up the session from the URL hash
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        setError('Could not get session. Please use the link from your email.')
      }
      setSession(data.session)
      setLoading(false)
    }
    getSession()
  }, [])

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match!')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setMessage('🎉 Password updated! Redirecting to login...')
      setTimeout(() => router.push('/login'), 2000)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <p>Loading...</p>
      </main>
    )
  }

  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-red-600">Auth session missing. Please use the link from your email.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <form onSubmit={handleResetPassword} className="flex flex-col gap-4 w-full max-w-xs">
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="border p-2 rounded text-gray-900 placeholder-gray-500 bg-white"
        />
        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          className="border p-2 rounded text-gray-900 placeholder-gray-500 bg-white"
        />
        <button type="submit" disabled={loading} className="bg-rose-500 text-white rounded p-2">
          {loading ? 'Updating...' : 'Set Password'}
        </button>
        {error && <div className="text-red-600">{error}</div>}
        {message && <div className="text-green-600">{message}</div>}
      </form>
    </main>
  )
} 