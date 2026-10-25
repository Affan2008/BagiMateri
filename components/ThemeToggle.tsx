'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-md border border-[var(--border)] bg-[var(--card)]" />
    )
  }

  const cycles = ['system', 'light', 'dark']
  const next = cycles[(cycles.indexOf(theme ?? 'system') + 1) % cycles.length]

  const icon =
    theme === 'light' ? (
      <Sun size={16} />
    ) : theme === 'dark' ? (
      <Moon size={16} />
    ) : (
      <Monitor size={16} />
    )

  const label =
      theme === 'light'
        ? 'Ganti ke mode gelap'
        : theme === 'dark'
        ? 'Ganti ke tema sistem'
        : 'Ganti ke mode terang'

  return (
    <button
      onClick={() => setTheme(next)}
      title={label}
      aria-label={label}
      className="w-9 h-9 rounded-md border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--secondary)] flex items-center justify-center transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
    >
      {icon}
    </button>
  )
}
