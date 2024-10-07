'use client'
import React, { useEffect } from 'react'
import AuthLayout from '../auth'
import BaseLayout from '@/components/custom/base-layout'
import CustomCard from '@/components/custom/card'
import dynamic from 'next/dynamic'
import Uploader from '@/components/custom/uploader'
import { Button, CircularProgress } from '@mui/material'
import useHome from './hooks'
const Editor = dynamic(() => import('@/components/custom/editor'), {
  ssr: false,
})
const Home = () => {
  const { submit, getHome, loading, homeState, setHomeState } = useHome()
  useEffect(() => {
    getHome()
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
            <Uploader
              maxSize={10 * 1024 * 1024}
              id='homePageUploadID'
              onChange={(file) => {
                setHomeState({ ...homeState, file })
              }}
              uploadType='image'
              value={homeState.file}
              label='Background Image'
              className='mb-5'
            />
            <Editor
              value={homeState.html}
              onChange={(html) => setHomeState({ ...homeState, html })}
            />
          </CustomCard>
        </div>
      </BaseLayout>
    </AuthLayout>
  )
}
export default Home
