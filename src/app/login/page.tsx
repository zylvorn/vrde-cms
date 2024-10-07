'use client'

import React from 'react'
import Image from 'next/image'
import CustomCard from '@/components/custom/card'
import CInput from '@/components/custom/input'
import { Button, CircularProgress } from '@mui/material'
import Logo from '@/components/icon/sample-company-logo.png'
import useLogin from './hooks'

const LoginPage = () => {
  const { cred, error, onClick, setError, setCred, loading } = useLogin()
  return (
    <div className='w-full bg-cream h-screen flex items-center justify-center'>
      <CustomCard size='sm'>
        <div className='items-center justify-center flex flex-col h-[500px]'>
          <div className='font-bold text-2xl mb-2'>Login VRDE CMS</div>
          <div className='text-sm mb-6'>Please Enter Your VRDE Account</div>
          <Image src={Logo} alt='VRDE Logo' width={70} className='mb-6' />
          <div className='w-[80%]'>
            <CInput
              label='Username'
              className='mb-4'
              value={cred.username}
              onChange={(e) => {
                setError(null)
                setCred({ ...cred, username: e.target.value })
              }}
            />
            <CInput
              label='Password'
              type='password'
              className='mb-8'
              value={cred.password}
              onChange={(e) => {
                setError(null)
                setCred({ ...cred, password: e.target.value })
              }}
            />
            {error && <small className='text-red-500'>{error}</small>}
            <Button variant='contained' fullWidth onClick={onClick}>
              {loading ? (
                <CircularProgress size={10} color='warning' />
              ) : (
                'Login'
              )}
            </Button>
          </div>
        </div>
      </CustomCard>
    </div>
  )
}
export default LoginPage
