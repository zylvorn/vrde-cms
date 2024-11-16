'use client'
import React, { useMemo, useState } from 'react'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { TFileLike } from '@/utils/constants/constants'
import Image from 'next/image'

type TProps = {
  uploadType: 'image'
  maxSize: number
  value?: File | TFileLike | null
  onChange: (v: File) => void
  label?: string
  id: string
  className?: string
  url?: string
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
  const [showPreview, setShowPreview] = useState(false)
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 })

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (props.url) {
      setModalPosition(calculatePosition(e))
      setShowPreview(true)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    setModalPosition(calculatePosition(e))
  }

  const handleMouseLeave = () => {
    setShowPreview(false)
  }
  const calculatePosition = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    const modalWidth = 200 // Approximate modal width
    const modalHeight = 200 // Approximate modal height
    const offset = 10 // Offset to avoid direct overlap with the cursor
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    // Calculate X position
    let x = clientX + offset
    if (x + modalWidth > windowWidth) {
      x = clientX - modalWidth - offset // Move left if out of bounds
    }

    // Calculate Y position
    let y = clientY + offset
    if (y + modalHeight > windowHeight) {
      y = clientY - modalHeight - offset // Move up if out of bounds
    }

    return { x, y }
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
        <div className='mr-10 justify-center m-2 flex gap-2'>
          <UploadFileIcon color='primary' />
        </div>
        <div
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className='justify-center w-[70%] text-center m-2 border-l-2 border-l-blue'
        >
          {props.value?.name || 'UPLOAD FILE'}
        </div>
      </div>
      {error && <small className='text-red'>{error}</small>}
      {showPreview && props.value?.name && (
        <div
          style={{
            position: 'fixed',
            top: modalPosition.y + 10, // Slight offset
            left: modalPosition.x + 10,
            zIndex: 1000,
            pointerEvents: 'none', // Prevent interaction
          }}
          className='p-2 border rounded bg-white shadow-lg'
        >
          <Image
            src={props.url || ''}
            alt='Preview'
            width={200}
            height={200}
            className='max-w-xs max-h-64 object-cover'
          />
        </div>
      )}
    </div>
  )
}
export default Uploader
