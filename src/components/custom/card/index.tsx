import React, { useMemo } from 'react'

type TProps = {
  size: 'md' | 'lg' | 'sm' | 'full'
  children?: React.ReactNode
  clasName?: string
}
const CustomCard: React.FC<TProps> = ({ size, children }) => {
  const wh = useMemo(() => {
    switch (size) {
      case 'full':
        return 'h-[calc(100vh-100px)] w-full'
      case 'lg':
        return 'w-[80%] min-w-[350px] h-[calc(100vh-75px)]'
      case 'md':
        return 'w-[50%] min-w-[350px] h-[calc(100vh-75px)]'
      case 'sm':
        return 'w-[30%] min-w-[350px] h-[calc(100vh-75px)]'
    }
  }, [size])
  return <div className={`p-2 py-4 bg-white rounded-lg ${wh}`}>{children}</div>
}
export default CustomCard
