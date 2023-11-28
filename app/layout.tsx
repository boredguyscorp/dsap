import { Inter } from 'next/font/google'
import type { Metadata } from 'next'

import { ModalProvider } from '@/providers/modal-provider'
// import { ToastProvider } from '@/providers/toast-provider'
import { ThemeProvider } from '@/providers/theme-provider'

import { Toaster } from '@/components/ui/toaster'
import { Toaster as ToasterReactHotToast } from 'react-hot-toast'

import './globals.css'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { siteConfig } from './config'
import { NextAuthProvider } from '@/providers/next-auth-provider'
import { ToasterSonner } from '@/components/toaster-sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} - "One Cause, One Voice, One Future"`,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: ['Next.js', 'React', 'Tailwind CSS', 'Server Components', 'Radix UI'],
  authors: [
    {
      name: 'TheBoredGuys Corp.',
      url: siteConfig.url.developer
    }
  ],
  creator: 'TheBoredGuys Corp.',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ],
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    creator: '@TheBoredGuysCorp.'
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-96x96.png'
  },
  manifest: `${siteConfig.url.home}/site.webmanifest`
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='en' suppressHydrationWarning>
      {/* <body className={inter.className}> */}
      <body className={`${inter.className} flex h-full flex-col antialiased`}>
        <NextAuthProvider>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
            <ModalProvider />
            {children}
            <TailwindIndicator />
          </ThemeProvider>
        </NextAuthProvider>
        <Toaster />
        <ToasterReactHotToast
          position='bottom-right'
          toastOptions={{
            style: {
              background: 'hsl(var(--background))',
              color: 'hsl(var(--foreground))',
              border: '1px solid hsl(var(--border))'
            }
          }}
        />
        <ToasterSonner />
      </body>
    </html>
  )
}
