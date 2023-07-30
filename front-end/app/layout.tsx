import './globals.scss'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'


export const metadata: Metadata = {
  title: 'Pong Game',
  description: 'This is the awesome pong game you can play on it'
}

const roboto = Montserrat({
  weight: ['200', '300','400', '500', '600', '700', '900'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>{children}</body>
    </html>
  )
}
