'use client'
import React, { useEffect } from 'react'
import AuthLayout from '../auth'
import BaseLayout from '@/components/custom/base-layout'
import CustomCard from '@/components/custom/card'
import dynamic from 'next/dynamic'
import { Button, CircularProgress } from '@mui/material'
import useContact from './hooks'
import CInput from '@/components/custom/input'
const Editor = dynamic(() => import('@/components/custom/editor'), {
  ssr: false,
})
const Contact = () => {
  const { submit, getContact, loading, contactState, setContactState } =
    useContact()
  useEffect(() => {
    getContact()
  }, [])
  return (
    <AuthLayout>
      <BaseLayout>
        <div className='flex justify-center'>
          <CustomCard size='lg'>
            <div className='flex gap-3'>
              <Button
                className='w-full mb-3'
                variant='contained'
                color='warning'
              >
                Preview
              </Button>
              <Button
                onClick={submit}
                className='w-full mb-3'
                variant='contained'
              >
                {loading ? (
                  <CircularProgress color='warning' size={10} />
                ) : (
                  'Save'
                )}
              </Button>
            </div>
            <CInput
              label='Whatsapp Number'
              className='mb-2'
              value={contactState.whatsapp}
              onChange={(e) =>
                setContactState({ ...contactState, whatsapp: e.target.value })
              }
            />
            <Editor
              value={contactState.html}
              onChange={(html) => setContactState({ ...contactState, html })}
            />
          </CustomCard>
        </div>
      </BaseLayout>
    </AuthLayout>
  )
}
export default Contact
