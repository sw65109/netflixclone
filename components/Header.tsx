'use client'

import { BellIcon } from '@heroicons/react/24/solid'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import useAuth from '../hooks/useAuth'
import {
  ACCOUNT_MENU_ITEMS,
  DEFAULT_AVATAR_URL,
  HEADER_SCROLL_Y,
  NAV_ITEMS,
  NETFLIX_LOGO_URL,
} from '../constants/ui'
import { useOutsideClick } from '../hooks/useOutsideClick'
import BasicMenu from './BasicMenu'
import Image from 'next/image'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const accountMenuRef = useRef<HTMLDivElement | null>(null)
  const { logout } = useAuth()

  useOutsideClick(accountMenuRef, () => setIsAccountMenuOpen(false), {
    enabled: isAccountMenuOpen,
  })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY >= HEADER_SCROLL_Y)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`${isScrolled ? 'bg-[#141414]' : ''}`}>
      <div className="flex items-center space-x-2 md:space-x-10">
        <Link href="/" aria-label="Go to home">
          <Image
            src={NETFLIX_LOGO_URL}
            alt="Netflix"
            width={100}
            height={100}
            className="cursor-pointer object-contain"
          />
        </Link>

        <BasicMenu />

        <ul className="hidden space-x-4 md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="headerLink">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center space-x-4 text-sm font-light">
        <Link href="/search" className="hidden sm:inline" aria-label="Search">
          <MagnifyingGlassIcon className="h-6 w-6 cursor-pointer" />
        </Link>

        <Link href="/kids" className="hidden cursor-pointer lg:inline">
          Kids
        </Link>

        <BellIcon className="h-6 w-6 cursor-pointer" />

        <div ref={accountMenuRef} className="group relative" data-account-menu>
          <button
            type="button"
            onClick={() => setIsAccountMenuOpen((v) => !v)}
            className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-haspopup="menu"
            aria-expanded={isAccountMenuOpen}
          >
            <Image
              src={DEFAULT_AVATAR_URL}
              alt="Profile"
              width={32}
              height={32}
              sizes="32px"
              className="cursor-pointer rounded"
            />
          </button>

          {isAccountMenuOpen && (
            <div className="absolute right-0 z-50 mt-3 w-56 text-sm" role="menu">
              <div className="absolute right-3 -top-2 h-0 w-0 border-x-8 border-b-8 border-x-transparent border-b-black" />

              <div className="overflow-hidden rounded-md border border-gray-700 bg-black shadow-xl">
                <div className="py-2">
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 px-4 py-2 text-left text-gray-200 hover:bg-[#11100F]"
                    onClick={() => setIsAccountMenuOpen(false)}
                  >
                    <Image
                      src={DEFAULT_AVATAR_URL}
                      alt=""
                      width={28}
                      height={28}
                      sizes="28px"
                      className="h-7 w-7 rounded"
                    />
                    <span>Profile</span>
                  </button>

                  {ACCOUNT_MENU_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block w-full px-4 py-2 text-left text-gray-300 hover:bg-[#11100F] hover:text-white"
                      onClick={() => setIsAccountMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                <div className="h-px bg-gray-700/80" />

                <button
                  type="button"
                  className="w-full px-4 py-3 text-left text-gray-300 hover:bg-[#11100F] hover:text-white"
                  onClick={async () => {
                    setIsAccountMenuOpen(false)
                    await logout()
                  }}
                >
                  Sign out of Netflix
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}