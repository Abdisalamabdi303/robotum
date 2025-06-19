'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase.from('Users').select('User_ID').limit(1)
        if (error) throw error
        setConnected(true)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    testConnection()
  }, [])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">Supabase DB Connection Test</h1>
      {loading && <p>Testing connection...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && connected && (
        <p className="text-green-600">Connected to Supabase database successfully!</p>
      )}
    </main>
  )
}
