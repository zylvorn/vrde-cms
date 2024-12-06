'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
type TProps = {
  children?: React.ReactNode
}
const BaseLayout: React.FC<TProps> = ({ children }) => {
  const pathName = usePathname()
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
          <Link
            href='/home'
            prefetch
            className={
              'font-bold cursor-pointer hover:text-blue' + selectedPath('home')
            }
          >
            Home
          </Link>
          <Link
            href='/projects'
            prefetch
            className={
              'font-bold cursor-pointer hover:text-blue' +
              selectedPath('project')
            }
          >
            Project
          </Link>
          <Link
            href='/about'
            prefetch
            className={
              'font-bold cursor-pointer hover:text-blue' + selectedPath('about')
            }
          >
            About
          </Link>
          <Link
            href='/contacts'
            prefetch
            className={
              'font-bold cursor-pointer hover:text-blue' +
              selectedPath('contact')
            }
          >
            Contact
          </Link>
        </div>
      </div>
      {children}
    </div>
  )
}
export default BaseLayout
