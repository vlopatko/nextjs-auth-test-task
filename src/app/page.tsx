'use client'

import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { DataTable } from '@/components/Table'
import { useAppSelector } from '@/redux/store'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const user = useAppSelector((state) => state.value)

  useEffect(() => {
    if (!user.isAuth) {
      redirect('/log-in')
    }
  }, [user])

  return (
    <MaxWidthWrapper className="flex h-full w-full flex-grow flex-col items-center justify-center py-8">
      <DataTable />
    </MaxWidthWrapper>
  )
}
