'use client'
import React, { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import axios from 'axios'

type TProps = {
  children?: React.ReactNode
}
const AuthLayout: React.FC<TProps> = ({ children }) => {
  const router = useRouter()
  const pathName = usePathname()
  const verifyToken = async () => {
    try {
      const token = localStorage.getItem('token')
      const { data } = await axios.get<{ status: string }>('/api/auth/verify', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (data.status === 'OK') {
        if (pathName === '/') {
          return router.push('/home')
        }
        return
      }
      router.push('/login')
    } catch (error) {
      console.log(error)
      router.push('/login')
    }
  }
  useEffect(() => {
    verifyToken()
  }, [router, pathName])
  useEffect(() => {
    router.prefetch('/login')
  }, [router])
  return children
}
export default AuthLayout
