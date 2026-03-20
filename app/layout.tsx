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
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-[var(--myb-navy)] focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--myb-primary-blue)]"
        >
          Skip to content
        </a>
        {children}
      </body>
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      )}
    </html>
  )
}
