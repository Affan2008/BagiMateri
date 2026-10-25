import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  buildHref: (page: number) => string
}

export function Pagination({ currentPage, totalPages, buildHref }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages: (number | '...')[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1 mt-8"
    >
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="flex items-center gap-1 px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--card)] text-sm hover:bg-[var(--secondary)] transition-colors"
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft size={14} /> Sebelumnya
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-3 py-2 rounded-md border border-[var(--border)] text-sm text-[var(--muted-foreground)] opacity-50 cursor-not-allowed">
          <ChevronLeft size={14} /> Sebelumnya
        </span>
      )}

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className="px-2 py-2 text-sm text-[var(--muted-foreground)]">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            aria-current={p === currentPage ? 'page' : undefined}
            className={`px-3 py-2 rounded-md border text-sm transition-colors ${
              p === currentPage
                ? 'bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] font-medium'
                : 'border-[var(--border)] bg-[var(--card)] hover:bg-[var(--secondary)]'
            }`}
          >
            {p}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="flex items-center gap-1 px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--card)] text-sm hover:bg-[var(--secondary)] transition-colors"
          aria-label="Halaman berikutnya"
        >
          Berikutnya <ChevronRight size={14} />
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-3 py-2 rounded-md border border-[var(--border)] text-sm text-[var(--muted-foreground)] opacity-50 cursor-not-allowed">
          Berikutnya <ChevronRight size={14} />
        </span>
      )}
    </nav>
  )
}
