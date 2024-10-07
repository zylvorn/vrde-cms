'use client'
import React, { useMemo, useState } from 'react'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { TFileLike } from '@/utils/constants/constants'

type TProps = {
  uploadType: 'image'
  maxSize: number
  value?: File | TFileLike | null
  onChange: (v: File) => void
  label?: string
  id: string
  className?: string
}

const Uploader: React.FC<TProps> = (props) => {
  const [error, setError] = useState<string | null>(null)
  const accept = useMemo(() => {
    switch (props.uploadType) {
      case 'image':
        return 'image/*'
      default:
        return ''
    }
  }, [props.uploadType])
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const maxSize = props.maxSize
      const strMax = (maxSize / (1024 * 1024)).toFixed(2)
      if (file.size > maxSize) {
        setError('Maximum file size is ' + strMax + ' MB')
      } else {
        props.onChange(file)
      }
    }
  }
  return (
    <div>
      {props.label && <small className='mb-1'>{props.label}</small>}
      <input
        id={props.id}
        type='file'
        accept={accept}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <div
        onClick={() => {
          document.getElementById(props.id)?.click()
        }}
        className={
          'flex flex-row items-center w-full border-2 rounded-md border-blue cursor-pointer ' +
          props.className
        }
      >
        <div className='mr-10 justify-center m-2'>
          <UploadFileIcon color='primary' />
        </div>
        <div className='justify-center w-[70%] text-center m-2 border-l-2 border-l-blue'>
          {props.value?.name || 'UPLOAD FILE'}
        </div>
      </div>
      {error && <small className='text-red'>{error}</small>}
    </div>
  )
}
export default Uploader
