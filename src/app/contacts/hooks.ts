'use client'
import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'

type TContactState = {
  html: string
  whatsapp: string
}
const useContact = () => {
  const [contactState, setContactState] = useState<TContactState>({
    html: '',
    whatsapp: '',
  })
  const [loading, setLoading] = useState(false)
  const submit = async () => {
    const token = localStorage.getItem('token')
    setLoading(true)
    try {
      axios.post(
        '/api/contacts',
        { html: contactState.html, whatsapp: contactState.whatsapp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setLoading(false)
      toast.success('Success')
    } catch (error) {
      setLoading(false)
      toast.error(String(error), { autoClose: 1000 })
    }
  }
  const getContact = async () => {
    try {
      const { data } = await axios.get<TContactState>('/api/contacts')
      setContactState({
        html: data.html,
        whatsapp: data.whatsapp,
      })
    } catch (error) {
      console.log(error)
    }
  }
  return {
    submit,
    loading,
    getContact,
    contactState,
    setContactState,
  }
}
export default useContact
