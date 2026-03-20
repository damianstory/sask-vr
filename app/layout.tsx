import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
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
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      )}
    </html>
  )
}
