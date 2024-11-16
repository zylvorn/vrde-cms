'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import axios, { AxiosError } from 'axios'
type TAPIResponse = {
  token?: string
  error?: null | string
}
const useLogin = () => {
  const router = useRouter()
  const [cred, setCred] = useState({ username: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const onClick = async () => {
    try {
      setLoading(true)
      setError(null)
      const body = {
        username: cred.username,
        password: cred.password,
      }
      const { data } = await axios.post<TAPIResponse>('/api/auth', body)
      if (data.token) {
        localStorage.setItem('token', data.token)
        router.push('/home')
        setLoading(false)
        return
      }
      setError('Token undefined')
      setLoading(false)
    } catch (error) {
      const err = error as AxiosError
      // @ts-ignore
      const responseData = err.response?.data as any
      setError(responseData?.error || err.message)
      setLoading(false)
    }
  }
  return {
    cred,
    error,
    onClick,
    setCred,
    loading,
    setError,
  }
}
export default useLogin
