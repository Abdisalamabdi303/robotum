'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const router = useRouter()

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