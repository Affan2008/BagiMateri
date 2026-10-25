import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { MaterialCard } from '@/components/MaterialCard'
import { Search, BookOpen, ArrowRight } from 'lucide-react'

export const revalidate = 60

async function getHomeData() {
  const [categories, recentMaterials] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { materials: { where: { status: 'PUBLISHED' } } } } },
    }),
    prisma.material.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: {
        author: { select: { username: true } },
        category: { select: { name: true, slug: true } },
      },
    }),
  ])
  return { categories, recentMaterials }
}

export default async function HomePage() {
  const { categories, recentMaterials } = await getHomeData()

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Hero */}
      <section className="text-center mb-14">
        <div className="flex justify-center mb-4">
          <BookOpen size={44} className="text-[var(--primary)]" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-[var(--foreground)]">
          BagiMateri
        </h1>
        <p className="text-[var(--muted-foreground)] max-w-xl mx-auto mb-8 text-base">
          Platform belajar mahasiswa yang ramah buat yang pulsanya menipis. Cari, baca, dan buat kontribusi materi kuliah secara minimalis dan hemat kuota.
        </p>

        {/* Search bar */}
        <form
          action="/library"
          method="GET"
          className="flex gap-2 max-w-lg mx-auto"
        >
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
            />
            <input
              type="search"
              name="search"
              placeholder="Cari materi kuliah…"
              className="w-full pl-10 pr-4 py-2.5 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Cari
          </button>
        </form>

        <div className="flex justify-center gap-4 mt-5 flex-wrap">
          <Link
            href="/library"
            className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1"
          >
            Cari materi <ArrowRight size={13} />
          </Link>
          <Link
            href="/create"
            className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1"
          >
            Buat materi baru <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Kategori Mata Kuliah</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/library?category=${cat.slug}`}
              className="flex flex-col items-center justify-center gap-1 p-4 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)] hover:bg-[var(--accent)] transition-all text-center"
            >
              <span className="text-sm font-medium text-[var(--foreground)]">{cat.name}</span>
              <span className="text-xs text-[var(--muted-foreground)]">
                {cat._count.materials} materi
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent materials */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Baru Diterbitkan</h2>
          <Link
            href="/library"
            className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1"
          >
            Lihat semua <ArrowRight size={13} />
          </Link>
        </div>

        {recentMaterials.length === 0 ? (
          <div className="text-center py-12 text-[var(--muted-foreground)]">
            <BookOpen size={36} className="mx-auto mb-3 opacity-40" />
            <p>Belum ada materi yang diterbitkan. Jadilah yang pertama berkontribusi!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentMaterials.map((m) => (
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
        )}
      </section>
    </div>
  )
}
