import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Aeconn | Intelligent Customer Check-in',
  description: 'Aeconn - Premium customer check-in management and marketing automation platform',
  icons: {
    icon: '/Aeconn_icon.png',
    shortcut: '/Aeconn_icon.png',
    apple: '/Aeconn_icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0A0A0C',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
