import { TFileLike } from '@/utils/constants/constants'
import { generateUUID } from '@/utils/generator/uuid'
import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'

export type TClient = {
  id: string
  name: string
  image: File | TFileLike | null
  existingImage?: boolean
}
type TClientBE = {
  id: string
  name: string
  image: string
}
type TSection = {
  id: string
  name: string
  html: string
}
type TAbouState = {
  clients: TClient[]
  sections: TSection[]
}
type TAbouStateFromBE = {
  clients: TClientBE[]
  sections: TSection[]
}

const useAbout = () => {
  const [aboutState, setAboutState] = useState<TAbouState>({
    clients: [],
    sections: [],
  })
  const [tab, setTab] = useState<'sections' | 'clients'>('sections')
  const [modal, setModal] = useState<{ isOpen: boolean; value: string }>({
    isOpen: false,
    value: '',
  })
  const [section, setSection] = useState<TSection>({
    id: generateUUID(),
    name: '',
    html: '',
  })
  const [focusID, setFocusID] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const getAbout = async () => {
    try {
      const { data } = await axios.get<TAbouStateFromBE>('/api/about')
      const ss = {
        ...data,
        clients: data.clients.map((item) => {
          return {
            ...item,
            image: { name: item.image },
            existingImage: true,
          }
        }),
      }
      const [first] = data.sections
      if (first) {
        setSection(first)
      }
      setAboutState(ss)
    } catch (error) {
      console.log(error)
    }
  }
  const submitSections = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const { data } = await axios.post<{
        data: TAbouState
        error: string | null
      }>(
        '/api/about/sections',
        { sections: aboutState.sections },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.error) {
        toast.error(data.error)
      } else {
        toast.success('Sections submitted')
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
      toast.error(String(error))
    }
  }
  const submitClients = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const dataClients = aboutState.clients.filter(
        (x) => x.name !== '' && x.name !== null && x.name !== undefined
      )
      if (dataClients.length > 0) {
        const dataSubmit = new FormData()
        dataClients.forEach((client) => {
          if (client.image instanceof File) {
            dataSubmit.append('images', client.image)
          }
        })
        const arr = dataClients.map((item) => {
          return {
            id: item.id,
            name: item.name,
            isExistingImage: item.existingImage,
            image: {
              name: item.image?.name || 'no-image',
            },
          }
        })
        dataSubmit.append('data', JSON.stringify(arr))
        const { data } = await axios.post('/api/about/clients', dataSubmit, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (data.error) {
          toast.error(data.error)
        } else {
          toast.success('Clients submitted')
        }
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const removeCurrentSection = () => {
    setAboutState({
      ...aboutState,
      sections: aboutState.sections.filter((x) => x.id !== section.id),
    })
    setSection({ id: generateUUID(), html: '', name: '' })
  }
  const submit = async () => {
    await submitSections()
    await submitClients()
  }

  const addClient = () => {
    const adder: TClient[] = [{ id: generateUUID(), image: null, name: '' }]
    setAboutState({
      ...aboutState,
      clients: adder.concat(aboutState.clients),
    })
  }
  return {
    tab,
    modal,
    setModal,
    section,
    setSection,
    setTab,
    aboutState,
    setAboutState,
    loading,
    getAbout,
    submitSections,
    focusID,
    setFocusID,
    removeCurrentSection,
    submitClients,
    submit,
    addClient,
  }
}
export default useAbout
