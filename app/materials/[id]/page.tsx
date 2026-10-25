import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { sanitizeHtml } from '@/lib/sanitize'
import { KatexRenderer } from '@/components/KatexRenderer'
import { ArrowLeft, Calendar, Tag, User, Pencil } from 'lucide-react'
import type { Metadata } from 'next'

interface Params {
  params: { id: string }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const material = await prisma.material.findUnique({
    where: { id: params.id },
    select: { title: true },
  })
  return { title: material?.title ?? 'Material' }
}

export default async function MaterialPage({ params }: Params) {
  const session = await auth()

  const material = await prisma.material.findUnique({
    where: { id: params.id },
    include: {
      author: { select: { id: true, username: true } },
      category: { select: { name: true, slug: true } },
    },
  })

  if (!material) notFound()

  // Drafts are only visible to the author
  if (
    material.status === 'DRAFT' &&
    session?.user?.id !== material.author.id
  ) {
    notFound()
  }

  const sanitizedHtml = sanitizeHtml(material.content)

  const date = new Date(material.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const isOwner = session?.user?.id === material.author.id

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back navigation */}
      <Link
        href="/library"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        Kembali ke daftar materi
      </Link>

      <article>
        {/* Header */}
        <header className="mb-8 pb-6 border-b border-[var(--border)]">
          {material.status === 'DRAFT' && (
            <span className="inline-block mb-3 text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 font-medium">
              Draft — hanya terlihat oleh kamu
            </span>
          )}
          <h1 className="text-3xl font-bold mb-4 leading-tight">{material.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-[var(--muted-foreground)]">
            <span className="flex items-center gap-1.5">
              <Tag size={13} />
              <Link
                href={`/library?category=${material.category.slug}`}
                className="hover:text-[var(--primary)] hover:underline"
              >
                {material.category.name}
              </Link>
            </span>
            <span className="flex items-center gap-1.5">
              <User size={13} />
              {material.author.username}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={13} />
              {date}
            </span>
          </div>

          {isOwner && (
            <div className="mt-4 flex gap-2">
              <Link
                href={`/materials/${material.id}/edit`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border)] rounded-md text-sm hover:bg-[var(--secondary)] transition-colors"
              >
                <Pencil size={13} />
                Edit
              </Link>
            </div>
          )}
        </header>

        {/* Content */}
        <KatexRenderer html={sanitizedHtml} />
      </article>
    </div>
  )
}
