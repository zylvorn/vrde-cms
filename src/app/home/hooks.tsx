'use client'

import { TFileLike } from '@/utils/constants/constants'
import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'
type THomeState = {
  file: File | TFileLike | null
  html: string
}
const useHome = () => {
  const [homeState, setHomeState] = useState<THomeState>({
    file: null,
    html: '',
  })
  const [loading, setLoading] = useState(false)
  const submit = async () => {
    const token = localStorage.getItem('token')
    setLoading(true)
    try {
      const form = new FormData()
      if (homeState.file instanceof File) {
        form.append('file', homeState.file)
      }
      form.append('html', homeState.html)
      axios.post('/api/home', form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setLoading(false)
      toast.success('Success')
    } catch (error) {
      setLoading(false)
      toast.error(String(error), { autoClose: 1000 })
    }
  }
  const getHome = async () => {
    try {
      const { data } = await axios.get<{ image_path: string; html: string }>(
        '/api/home'
      )
      setHomeState({
        file: { name: data.image_path },
        html: data.html,
      })
    } catch (error) {
      console.log(error)
    }
  }
  return {
    submit,
    loading,
    getHome,
    homeState,
    setHomeState,
  }
}
export default useHome
