import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import { TRPCProvider } from '@/lib/trpc/provider'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Mozilla Chipher',
  description: 'The Conspiracy',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <script defer src="https://analytics-umami.zephyyrr.in/script.js" data-website-id="c32f955d-1e26-4e7f-85b9-6fc2e65759f1"></script>
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <TRPCProvider>
            {children}
          </TRPCProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
