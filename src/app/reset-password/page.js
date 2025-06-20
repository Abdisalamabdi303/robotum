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
    let timeout
    // Force Supabase to process the hash if present
    if (typeof window !== 'undefined' && window.location.hash) {
      supabase.auth._processUrlHash(window.location.hash)
    }
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setSession(data.session)
        setLoading(false)
      } else {
        // Listen for auth state changes (e.g. after hash is processed)
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session) {
            setSession(session)
            setLoading(false)
            clearTimeout(timeout)
          }
        })
        // After 3 seconds, if still no session, show error
        timeout = setTimeout(() => {
          setLoading(false)
        }, 3000)
        // Cleanup
        return () => {
          listener.subscription.unsubscribe()
          clearTimeout(timeout)
        }
      }
    })
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

  const goToLogin = () => {
    router.push('/login')
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
      <main className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <p className="text-red-600 text-center">
          Auth session missing. Please make sure you used the link from your email and that your browser did not strip the URL hash.<br />
          If the problem persists, try copying and pasting the full link into your browser&apos;s address bar.
        </p>
        <button onClick={goToLogin} className="bg-rose-500 text-white rounded p-2 mt-4">Go to Login</button>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
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
      <button onClick={goToLogin} className="bg-rose-500 text-white rounded p-2 mt-2">Back to Login</button>
    </main>
  )
} 