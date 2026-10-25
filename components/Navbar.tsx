'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { BookOpen, Library, User, LogOut, LogIn, PlusCircle, Menu, X } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { useState } from 'react'

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/library', label: 'Daftar Materi' },
]

export function Navbar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)] bg-opacity-95 backdrop-blur-sm">
      <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-[var(--foreground)] shrink-0"
        >
          <BookOpen size={20} className="text-[var(--primary)]" />
          <span className="hidden sm:inline text-sm">BagiMateri</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                isActive(link.href)
                  ? 'bg-[var(--accent)] text-[var(--accent-foreground)] font-medium'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {session && (
            <Link
              href="/my-materials"
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                isActive('/my-materials')
                  ? 'bg-[var(--accent)] text-[var(--accent-foreground)] font-medium'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]'
              }`}
            >
              Materi Saya
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {status === 'loading' ? null : session ? (
            <>
              <Link
                href="/create"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <PlusCircle size={14} />
                Buat
              </Link>
              <span className="hidden sm:flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
                <User size={14} />
                {session.user.username}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border)] rounded-md text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors"
              >
                <LogOut size={14} />
                Keluar
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <LogIn size={14} />
              Masuk
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)]"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--background)] px-4 py-3 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2 rounded-md text-sm transition-colors ${
                isActive(link.href)
                  ? 'bg-[var(--accent)] text-[var(--accent-foreground)] font-medium'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {session && (
            <Link
              href="/my-materials"
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2 rounded-md text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]"
            >
              Materi Saya
            </Link>
          )}
          <div className="border-t border-[var(--border)] pt-2 mt-1 flex flex-col gap-2">
            {session ? (
              <>
                <Link
                  href="/create"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md text-sm font-medium"
                >
                  <PlusCircle size={14} />
                  Buat Materi
                </Link>
                <div className="flex items-center gap-1.5 px-3 py-2 text-sm text-[var(--muted-foreground)]">
                  <User size={14} />
                  {session.user.username}
                </div>
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    signOut({ callbackUrl: '/' })
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 border border-[var(--border)] rounded-md text-sm text-[var(--muted-foreground)]"
                >
                  <LogOut size={14} />
                  Keluar
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-1.5 px-3 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md text-sm font-medium"
              >
                <LogIn size={14} />
                Masuk
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
