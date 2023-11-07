'use client'

import React from 'react'
import { ModeToggle } from './ThemeToogle'
import { Button } from './ui/button'
import { useDispatch } from 'react-redux'
import { logOut } from '@/redux/slices/auth'

const NavPanel = () => {
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logOut())
  }

  return (
    <div
      id="navbarrr"
      className="sticky left-0 top-0 z-10 mx-auto flex items-center justify-between border-b border-zinc-200 bg-[var(--header-background)] px-8 py-4 font-semibold"
    >
      <h1>ICAP</h1>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <Button variant={'ghost'} onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </div>
  )
}

export default NavPanel
