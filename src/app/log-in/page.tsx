'use client'

import { LoginForm } from '@/components/LoginForm'
import { useAppSelector } from '@/redux/store'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

const Page = () => {
  const user = useAppSelector((state) => state.value)

  useEffect(() => {
    if (user.isAuth) {
      redirect('/')
    }
  }, [user.isAuth])

  return (
    <div className="mx-auto min-w-full px-2 py-4">
      <LoginForm />
    </div>
  )
}

export default Page
