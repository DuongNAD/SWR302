import React from 'react'
import { useLocation } from 'react-router-dom'

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation()

  return (
    <div key={pathname} className="page-enter min-h-[50vh]">
      {children}
    </div>
  )
}
