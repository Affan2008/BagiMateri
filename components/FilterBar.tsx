'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
}

interface FilterBarProps {
  categories: Category[]
  currentSearch: string
  currentCategory: string
  currentSort: string
}

export function FilterBar({
  categories,
  currentSearch,
  currentCategory,
  currentSort,
}: FilterBarProps) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [search, setSearch] = useState(currentSearch)

  const buildQuery = (overrides: Record<string, string>) => {
    // Build from the props that were passed in (server-side searchParams),
    // then apply any overrides. This avoids useSearchParams() entirely.
    const base: Record<string, string> = {}
    if (currentSearch) base.search = currentSearch
    if (currentCategory) base.category = currentCategory
    if (currentSort && currentSort !== 'newest') base.sort = currentSort

    const params = new URLSearchParams({ ...base, ...overrides })
    // Remove empty values and reset pagination
    Array.from(params.entries()).forEach(([k, v]) => {
      if (!v) params.delete(k)
    })
    params.delete('page')
    const qs = params.toString()
    return `/library${qs ? `?${qs}` : ''}`
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(() => {
      router.push(buildQuery({ search }))
    })
  }

  const handleCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    startTransition(() => {
      router.push(buildQuery({ category: e.target.value }))
    })
  }

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    startTransition(() => {
      router.push(buildQuery({ sort: e.target.value }))
    })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 flex gap-2">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari materi…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-[var(--border)] rounded-md bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Cari
        </button>
      </form>

      {/* Filters */}
      <div className="flex gap-2 items-center">
        <SlidersHorizontal size={14} className="text-[var(--muted-foreground)] shrink-0" />
        <select
          value={currentCategory}
          onChange={handleCategory}
          className="py-2 pl-2 pr-7 text-sm border border-[var(--border)] rounded-md bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          aria-label="Filter by category"
        >
          <option value="">Semua kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={currentSort}
          onChange={handleSort}
          className="py-2 pl-2 pr-7 text-sm border border-[var(--border)] rounded-md bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          aria-label="Urutkan"
        >
          <option value="newest">Terbaru</option>
          <option value="oldest">Terlama</option>
          <option value="title">A – Z</option>
        </select>
      </div>
    </div>
  )
}
