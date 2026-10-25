import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { EditorForm } from '@/components/EditorForm'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

interface Params {
  params: { id: string }
}

export const metadata: Metadata = { title: 'Edit Materi' }

export default async function EditPage({ params }: Params) {
  const session = await auth()
  if (!session?.user) redirect(`/login?next=/materials/${params.id}/edit`)

  const [material, categories] = await Promise.all([
    prisma.material.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  if (!material) notFound()
  if (material.authorId !== session.user.id) notFound()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href={`/materials/${material.id}`}
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        Kembali ke materi
      </Link>

      <h1 className="text-2xl font-bold mb-6">Edit Materi</h1>

      <EditorForm
        categories={categories}
        initialTitle={material.title}
        initialContent={material.content}
        initialCategoryId={material.categoryId}
        materialId={material.id}
      />
    </div>
  )
}
