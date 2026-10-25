'use client'

import Link from 'next/link'
import { Calendar, User, Tag } from 'lucide-react'

interface MaterialCardProps {
  id: string
  title: string
  authorUsername: string
  categoryName: string
  categorySlug: string
  createdAt: string | Date
  status?: string
  showStatus?: boolean
}

export function MaterialCard({
  id,
  title,
  authorUsername,
  categoryName,
  categorySlug,
  createdAt,
  status,
  showStatus = false,
}: MaterialCardProps) {
  const date = new Date(createdAt).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <Link
      href={`/materials/${id}`}
      className="group block rounded-lg border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)] hover:bg-[var(--accent)] transition-all p-4"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h2 className="text-base font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors line-clamp-2 leading-snug">
          {title}
        </h2>
        {showStatus && status && (
          <span
            className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
              status === 'PUBLISHED'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
            }`}
          >
            {status === 'PUBLISHED' ? 'Diterbitkan' : 'Draft'}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-[var(--muted-foreground)]">
        <span className="flex items-center gap-1">
          <Tag size={11} />
          <Link
            href={`/library?category=${categorySlug}`}
            onClick={(e) => e.stopPropagation()}
            className="hover:text-[var(--primary)] hover:underline"
          >
            {categoryName}
          </Link>
        </span>
        <span className="flex items-center gap-1">
          <User size={11} />
          {authorUsername}
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={11} />
          {date}
        </span>
      </div>
    </Link>
  )
}
