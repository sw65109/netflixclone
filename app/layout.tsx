import type { Metadata } from 'next'
import './globals.css'
import Providers from './providers'
import Header from '../components/Header'
import HeaderGate from './_components/HeaderGate'
import GlobalModal from './_components/GlobalModal'

export const metadata: Metadata = {
  title: 'Netflix Clone',
  description: 'Netflix clone (App Router)',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="bg-[#141414] text-white">
        <Providers>
          <HeaderGate>
            <Header />
          </HeaderGate>
          {children}

          <GlobalModal />
        </Providers>
      </body>
    </html>
  )
}