import './globals.css'

import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import { Suspense } from 'react'

import { TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Finance Calc',
  description: '',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'flex min-h-screen items-center justify-center bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <Suspense fallback={'sexo'}>
          <TooltipProvider>{children}</TooltipProvider>
        </Suspense>
      </body>
    </html>
  )
}
