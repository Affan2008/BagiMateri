import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { EditorForm } from '@/components/EditorForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Buat Materi' }

export default async function CreatePage() {
  const session = await auth()
  if (!session?.user) redirect('/login?next=/create')

  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Buat Materi</h1>
      <EditorForm categories={categories} />
    </div>
  )
}
