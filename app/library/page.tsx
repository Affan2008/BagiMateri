import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { MaterialCard } from '@/components/MaterialCard'
import { FilterBar } from '@/components/FilterBar'
import { Pagination } from '@/components/Pagination'
import { Library } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Daftar Materi' }

const PAGE_SIZE = 12

interface LibraryPageProps {
  searchParams: {
    search?: string
    category?: string
    sort?: string
    page?: string
  }
}

async function getLibraryData(params: LibraryPageProps['searchParams']) {
  const search = params.search ?? ''
  const category = params.category ?? ''
  const sort = params.sort ?? 'newest'
  const page = Math.max(1, parseInt(params.page ?? '1', 10))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: Record<string, any> = { status: 'PUBLISHED' }

  if (search) where.title = { contains: search }
  if (category) where.category = { slug: category }

  const orderBy =
    sort === 'oldest'
      ? { createdAt: 'asc' as const }
      : sort === 'title'
      ? { title: 'asc' as const }
      : { createdAt: 'desc' as const }

  const [total, materials, categories] = await Promise.all([
    prisma.material.count({ where }),
    prisma.material.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        author: { select: { username: true } },
        category: { select: { name: true, slug: true } },
      },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  return {
    materials,
    categories,
    total,
    page,
    totalPages: Math.ceil(total / PAGE_SIZE),
  }
}

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const { materials, categories, total, page, totalPages } = await getLibraryData(
    searchParams
  )

  const buildHref = (p: number) => {
    const params = new URLSearchParams()
    if (searchParams.search) params.set('search', searchParams.search)
    if (searchParams.category) params.set('category', searchParams.category)
    if (searchParams.sort) params.set('sort', searchParams.sort)
    if (p > 1) params.set('page', String(p))
    const qs = params.toString()
    return `/library${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Library size={24} className="text-[var(--primary)]" />
        <div>
          <h1 className="text-2xl font-bold">Daftar Materi</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            {total} materi diterbitkan
          </p>
        </div>
      </div>

      <Suspense fallback={null}>
        <FilterBar
          categories={categories}
          currentSearch={searchParams.search ?? ''}
          currentCategory={searchParams.category ?? ''}
          currentSort={searchParams.sort ?? 'newest'}
        />
      </Suspense>

      {materials.length === 0 ? (
        <div className="text-center py-16 text-[var(--muted-foreground)]">
          <Library size={40} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">Materi tidak ditemukan</p>
          <p className="text-sm mt-1">
            {searchParams.search || searchParams.category
              ? 'Coba ubah kata kunci atau filter pencarian.'
              : 'Jadilah yang pertama menerbitkan materi!'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {materials.map((m) => (
              <MaterialCard
                key={m.id}
                id={m.id}
                title={m.title}
                authorUsername={m.author.username}
                categoryName={m.category.name}
                categorySlug={m.category.slug}
                createdAt={m.createdAt}
              />
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            buildHref={buildHref}
          />
        </>
      )}
    </div>
  )
}
