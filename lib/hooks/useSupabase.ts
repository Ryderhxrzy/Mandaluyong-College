import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useSupabaseQuery<T>(
  query: () => Promise<{ data: T | null; error: any }>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data, error } = await query()
        if (error) {
          setError(error)
        } else {
          setData(data)
        }
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, dependencies)

  return { data, loading, error }
}
