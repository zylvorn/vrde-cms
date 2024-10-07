import { TFileLike } from '@/utils/constants/constants'
import { generateUUID } from '@/utils/generator/uuid'
import { GridBaseColDef } from '@mui/x-data-grid/internals'
import axios from 'axios'
import moment from 'moment'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteForever'
import renderCellExpand from '@/utils/rendercell'

export type TTag = {
  name: string
  group: string
  id: string
}
export type TProject = {
  isEdit?: boolean
  id: string
  client: string
  date: Date
  tags: TTag[]
  team: string
  images: {
    id: string
    isExisting?: boolean
    file: File | TFileLike | null
    name: string
  }[]
  name: string
  location: string
}
type TProjectBE = {
  id: string
  client: string
  date: Date
  tags: TTag[]
  team: string
  images: string[]
  name: string
  location: string
}
export type TData = {
  projects: TProject[]
  tags: TTag[]
  html: string
}
type TDataBE = {
  projects: TProjectBE[]
  tags: TTag[]
  html: string
}
const useProjects = () => {
  const [projectState, setProjectState] = useState<TData>({
    projects: [],
    tags: [],
    html: '',
  })
  const [projectItem, setProjectItem] = useState<{
    modal: boolean
    data: TProject | null
  }>({ modal: false, data: null })
  const [modalDelete, setModalDelete] = useState<{
    modal: boolean
    data: TProject | null
  }>({ modal: false, data: null })
  const [modalTags, setModalTags] = useState<{ modal: boolean; data: TTag[] }>({
    modal: false,
    data: [],
  })
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<'projects' | 'editor'>('projects')
  const [searchKey, setSearchKey] = useState('')

  const getProjects = async () => {
    try {
      const { data } = await axios.get<TDataBE>('/api/projects')
      const ss = {
        ...data,
        projects: data.projects.map((item) => {
          return {
            ...item,
            images: item.images.map((e) => ({
              name: e,
              id: generateUUID(),
              isExisting: true,
              file: { name: e },
            })),
          }
        }),
      }
      setProjectState(ss)
    } catch (error) {
      console.log(error)
    }
  }
  const submitUpdateTags = async () => {
    const dataSubmitted = modalTags.data
    const token = localStorage.getItem('token')
    const { data } = await axios.put<{ data: TTag[]; error: string | null }>(
      '/api/projects/tags',
      { tags: dataSubmitted },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (data.error) {
      toast.error(String(data.error))
      return
    } else {
      toast.success('Categories updated')
      setProjectState({ ...projectState, tags: data.data })
      setModalTags({ modal: false, data: [] })
    }
  }
  const submitProject = async () => {
    const formData = new FormData()
    const dataItem = projectItem.data
    const token = localStorage.getItem('token')
    if (dataItem) {
      setLoading(true)
      type TDataBody = {
        id: string
        client: string
        name: string
        location: string
        date: Date
        tags: TTag[]
        team: string
        images: { name: string; id: string; isExisting?: boolean }[]
      }
      const imgs = dataItem.images.map((item) => {
        return {
          name: item.name,
          id: item.id,
          isExisting: item.isExisting || false,
        }
      })
      const dataBodySend: TDataBody = {
        id: dataItem.id,
        name: dataItem.name,
        location: dataItem.location,
        client: dataItem.client,
        date: dataItem.date,
        tags: dataItem.tags,
        team: dataItem.team,
        images: imgs,
      }
      formData.append('data', JSON.stringify(dataBodySend))
      dataItem.images
        .filter((x) => !x.isExisting)
        .forEach((img) => {
          if (img.file instanceof File) {
            formData.append('images', img.file)
          }
        })
      if (dataItem.isEdit) {
        try {
          const { data } = await axios.put<{
            data: TProjectBE
            error: string | null
          }>('/api/projects/project', formData, {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (data.error) {
            toast.success(String(data.error))
          } else {
            setProjectItem({ modal: false, data: null })
            await getProjects()
            toast.success(`Project ${dataBodySend.name} Updated`)
          }
        } catch (error) {
          toast.error(String(error))
        }
      } else {
        try {
          const { data } = await axios.post<{
            data: TProjectBE
            error: string | null
          }>('/api/projects/project', formData, {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (data.error) {
            toast.success(String(data.error))
          } else {
            setProjectItem({ modal: false, data: null })
            await getProjects()
            toast.success('Project Submitted')
          }
        } catch (error) {
          toast.error(String(error))
        }
      }
      setLoading(false)
    }
  }
  const submitEditor = async () => {
    try {
      const token = localStorage.getItem('token')
      const { data } = await axios.post<{ data: string }>(
        '/api/projects/editor',
        { html: projectState.html },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setProjectState({ ...projectState, html: data.data })
      toast.success('Editor submitted')
    } catch (error) {
      console.log(error)
      toast.error(String(error))
    }
  }
  const submitDelete = async () => {
    if (modalDelete.data) {
      try {
        setLoading(true)
        setModalDelete({ data: null, modal: false })
        const token = localStorage.getItem('token')
        await axios.delete(`/api/projects/project/${modalDelete.data.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        toast.success(`${modalDelete.data.name} Deleted`)
        getProjects()
        setLoading(false)
      } catch (error) {
        console.log(error)
        toast.error(String(error))
        setLoading(false)
      }
    }
  }
  const columns = useMemo(() => {
    const cols: GridBaseColDef<TProject>[] = [
      {
        field: 'name',
        headerName: 'Project Name',
        width: 300,
        renderCell: ({ row }) => row.name,
      },
      {
        field: 'location',
        headerName: 'Location',
        width: 300,
        renderCell: ({ row }) => row.location,
      },
      {
        field: 'categories',
        headerName: 'Categories',
        width: 300,
        valueGetter: (_, row) => {
          return row.tags.map((item) => item.name).join(', ')
        },
        renderCell: renderCellExpand,
      },
      {
        field: 'date',
        headerName: 'Date',
        renderCell: ({ row }) => moment(row.date).format('DD-MM-YYYY'),
      },
      {
        field: 'action',
        headerName: 'Action',
        renderCell: ({ row }) => {
          return (
            <div className='flex gap-3 items-center h-full'>
              <EditIcon
                onClick={() => {
                  setProjectItem({
                    modal: true,
                    data: {
                      isEdit: true,
                      ...row,
                    },
                  })
                }}
                className='cursor-pointer'
              />
              <DeleteIcon
                className='cursor-pointer'
                onClick={() => {
                  setModalDelete({
                    modal: true,
                    data: {
                      ...row,
                    },
                  })
                }}
              />
            </div>
          )
        },
      },
    ]
    return cols
  }, [projectState.projects])
  const rows = useMemo(() => {
    const data = projectState.projects
    return data.filter((item) => {
      return item.name.toLowerCase().includes(searchKey.toLowerCase())
    })
  }, [searchKey, projectState.projects])
  return {
    columns,
    rows,
    projectState,
    setProjectState,
    loading,
    setLoading,
    getProjects,
    tab,
    setTab,
    projectItem,
    setProjectItem,
    modalTags,
    setModalTags,
    submitUpdateTags,
    submitProject,
    submitEditor,
    submitDelete,
    modalDelete,
    setModalDelete,
    setSearchKey,
    searchKey,
  }
}
export default useProjects
