import { useEffect, useState, useRef } from "react"

const useFetch = <T, P = void>(
  fetchFunction: (params?: P) => Promise<T>,
  autoFetch = true
) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const lastParams = useRef<P | undefined>(undefined)

  const fetchData = async (params?: P) => {
    try {
      setLoading(true)
      setError(null)
      lastParams.current = params
      const result = await fetchFunction(params)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"))
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setData(null)
    setLoading(false)
    setError(null)
  }

  useEffect(() => {
    if (autoFetch) {
      fetchData()
    }
  }, [])

  return {
    data,
    loading,
    error,
    refetch: (params?: P) => fetchData(params ?? lastParams.current),
    reset
  }
}

export default useFetch
