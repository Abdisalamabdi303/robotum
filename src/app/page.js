'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase.from('your_table').select('*').limit(1)
        if (error) throw error
        console.log('Supabase connection successful:', data)
      } catch (error) {
        console.error('Error connecting to Supabase:', error.message)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    testConnection()
  }, [])

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      {loading && <p>Testing connection...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && <p className="text-green-500">Connected to Supabase successfully!</p>}
    </main>
  )
}
