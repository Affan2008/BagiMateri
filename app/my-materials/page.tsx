import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { PlusCircle, BookText } from 'lucide-react'
import { MyMaterialsList } from './MyMaterialsList'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Materi Saya' }

export default async function MyMaterialsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login?next=/my-materials')

  const materials = await prisma.material.findMany({
    where: { authorId: session.user.id },
    orderBy: { updatedAt: 'desc' },
    include: {
      category: { select: { name: true, slug: true } },
    },
  })

  const published = materials.filter((m) => m.status === 'PUBLISHED')
  const drafts = materials.filter((m) => m.status === 'DRAFT')

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookText size={24} className="text-[var(--primary)]" />
          <div>
            <h1 className="text-2xl font-bold">Materi Saya</h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              {session.user.username} &middot; {materials.length} total
            </p>
          </div>
        </div>
        <Link
          href="/create"
          className="flex items-center gap-1.5 px-3 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <PlusCircle size={14} />
          Buat
        </Link>
      </div>

      {materials.length === 0 ? (
        <div className="text-center py-16 text-[var(--muted-foreground)]">
          <BookText size={40} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">Belum ada materi</p>
          <p className="text-sm mt-1">Buat materi pertamamu untuk mulai berkontribusi.</p>
          <Link
            href="/create"
            className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md text-sm font-medium hover:opacity-90"
          >
            <PlusCircle size={14} />
            Buat materi
          </Link>
        </div>
      ) : (
        <>
          {published.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-3 text-green-700 dark:text-green-400">
                Diterbitkan ({published.length})
              </h2>
              <MyMaterialsList materials={published} />
            </section>
          )}
          {drafts.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3 text-yellow-700 dark:text-yellow-400">
                Draft ({drafts.length})
              </h2>
              <MyMaterialsList materials={drafts} />
            </section>
          )}
        </>
      )}
    </div>
  )
}
