import { Inter } from 'next/font/google'
import './globals.css'
import { cn, constructMetadata } from '@/lib/utils'
import { ReduxProvider } from '@/redux/provider'
import { ThemeProvider } from '@/components/theme-provider'
import NavPanel from '@/components/NavPanel'

const inter = Inter({ subsets: ['latin'] })

export const metadata = constructMetadata()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={cn('min-h-screen font-sans antialiased', inter.className)}
      >
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NavPanel />
            {children}
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
