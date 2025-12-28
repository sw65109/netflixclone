"use client"

import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { Bars3Icon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { NAV_ITEMS } from '../constants/ui'

export default function BasicMenu() {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const go = (href: string) => {
    handleClose()
    router.push(href)
  }

  return (
    <div className="md:hidden">
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        className="min-w-0! gap-2! capitalize! text-white!"
      >
        <Bars3Icon className="h-6 w-6" />
        <span className="text-sm">Browse</span>
      </Button>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        className="menu"
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {NAV_ITEMS.map((item) => (
          <MenuItem key={item.href} onClick={() => go(item.href)}>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}