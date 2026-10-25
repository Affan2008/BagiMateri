import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { SessionWrapper } from '@/components/SessionWrapper'
import { Navbar } from '@/components/Navbar'

export const metadata: Metadata = {
  title: {
    default: 'BagiMateri',
    template: '%s | BagiMateri',
  },
  description:
    'Platform belajar mahasiswa yang ramah buat yang pulsanya menipis. Cari, baca, dan buat kontribusi materi kuliah secara minimalis dan hemat kuota.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <ThemeProvider>
          <SessionWrapper>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <footer className="border-t border-[var(--border)] mt-16 py-8 text-center text-sm text-[var(--muted-foreground)]">
              <div className="max-w-6xl mx-auto px-4">
                <p>
                  BagiMateri &mdash; dibuat untuk mahasiswa di mana saja.
                </p>
              </div>
            </footer>
          </SessionWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
