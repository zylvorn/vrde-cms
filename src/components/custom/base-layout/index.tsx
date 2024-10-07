'use client'
import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
type TProps = {
  children?: React.ReactNode
}
const BaseLayout: React.FC<TProps> = ({ children }) => {
  const pathName = usePathname()
  const router = useRouter()
  const onClick = (p: string) => {
    router.push(p)
  }
  const selectedPath = (p: string) => {
    if (pathName.includes(p)) {
      return ' underline text-blue'
    }
    return ' text-black'
  }
  return (
    <div
      className='w-full h-screen'
      style={{ backgroundImage: `url('/images/background.jpg')` }}
    >
      <div className='flex w-full items-center justify-center h-[70px] bg-white mb-2'>
        <div className='flex w-[40%] items-center justify-around'>
          <div
            onClick={() => onClick('/home')}
            className={
              'font-bold cursor-pointer hover:text-blue' + selectedPath('home')
            }
          >
            Home
          </div>
          <div
            onClick={() => onClick('/projects')}
            className={
              'font-bold cursor-pointer hover:text-blue' +
              selectedPath('project')
            }
          >
            Project
          </div>
          <div
            onClick={() => onClick('/about')}
            className={
              'font-bold cursor-pointer hover:text-blue' + selectedPath('about')
            }
          >
            About
          </div>
          <div
            onClick={() => onClick('/contacts')}
            className={
              'font-bold cursor-pointer hover:text-blue' +
              selectedPath('contact')
            }
          >
            Contact
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}
export default BaseLayout
