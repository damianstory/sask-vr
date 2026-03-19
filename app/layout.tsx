import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import '@/styles/globals.css'

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
  weight: ['300', '800'],
})

export const metadata: Metadata = {
  title: 'Carpentry Career Explorer',
  description: 'Explore what carpentry in Saskatchewan is really like',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={openSans.variable}>
      <body>{children}</body>
    </html>
  )
}
