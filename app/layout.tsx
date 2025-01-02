import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from "sonner"
import Providers from './providers'
import { AccessibilityProvider } from '@/lib/AccessibilityContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'VisionCart',
  description: 'Smart glasses for visually impaired people',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AccessibilityProvider>
            {children}
            <Toaster />
          </AccessibilityProvider>
        </Providers>
      </body>
    </html>
  )
}

