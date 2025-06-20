'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.push('/admin/dashboard')
    } catch (error) {
      setError('Incorrect email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Check if already authenticated
  useState(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.push('/admin/dashboard')
    })
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-rose-200 to-rose-400">
      <div className="w-full max-w-md p-8 rounded-3xl shadow-2xl bg-white/90 border-4 border-rose-300 relative">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-24 h-24 bg-rose-400 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
            <span className="text-5xl">🤖</span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold text-rose-600 drop-shadow-sm text-center">Robotum School</h1>
        </div>
        <form onSubmit={handleLogin} className="mt-20 space-y-6 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-rose-700 mb-2 text-center">Admin Login</h2>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border-2 border-rose-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none text-lg transition mb-2 bg-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border-2 border-rose-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none text-lg transition mb-2 bg- white text-black"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-lg shadow-lg transition disabled:opacity-60 mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          {error && <div className="w-full text-center text-red-600 font-semibold bg-red-100 rounded-xl py-2 mt-2">{error}</div>}
        </form>
        <div className="mt-8 flex flex-col items-center">
          <p className="text-rose-400 text-sm">🤖 Robotum School cares about your safety!</p>
          <div className="flex gap-2 mt-2">
            <span className="inline-block w-3 h-3 bg-rose-400 rounded-full animate-bounce"></span>
            <span className="inline-block w-3 h-3 bg-rose-500 rounded-full animate-bounce delay-100"></span>
            <span className="inline-block w-3 h-3 bg-rose-600 rounded-full animate-bounce delay-200"></span>
          </div>
        </div>
      </div>
    </main>
  )
} 