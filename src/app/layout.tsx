import type { Metadata } from 'next'
import localFont from 'next/font/local'
import '../components/styles/globals.css'

import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
const geistSans = localFont({
  src: '../components/styles/fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: '../components/styles/fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'VRDE CMS',
  description: 'VRDE CMS',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastContainer
          autoClose={1000}
          position='top-right'
          hideProgressBar
          newestOnTop={false}
          draggable
          closeOnClick
          theme={'colored'}
        />
        {children}
      </body>
    </html>
  )
}
