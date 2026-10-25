'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Pencil, Trash2, Eye, Calendar, Tag } from 'lucide-react'

interface Material {
  id: string
  title: string
  status: string
  createdAt: Date
  updatedAt: Date
  category: {
    name: string
    slug: string
  }
}

export function MyMaterialsList({ materials }: { materials: Material[] }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Hapus "${title}"?\n\nTindakan ini tidak bisa dibatalkan.`)) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/materials/${id}`, { method: 'DELETE' })
      if (res.ok) {
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error ?? 'Gagal menghapus materi.')
      }
    } catch {
      alert('Gagal terhubung ke server. Coba lagi.')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {materials.map((m) => {
        const updated = new Date(m.updatedAt).toLocaleDateString('id-ID', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
        return (
          <div
            key={m.id}
            className="flex items-center justify-between gap-3 p-4 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--secondary)] transition-colors"
          >
            <div className="flex-1 min-w-0">
              <Link
                href={`/materials/${m.id}`}
                className="font-medium text-sm hover:text-[var(--primary)] hover:underline line-clamp-1"
              >
                {m.title}
              </Link>
              <div className="flex flex-wrap gap-3 mt-1 text-xs text-[var(--muted-foreground)]">
                <span className="flex items-center gap-1">
                  <Tag size={10} />
                  {m.category.name}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={10} />
                  {updated}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Link
                href={`/materials/${m.id}`}
                title="Lihat"
                aria-label="Lihat materi"
                className="w-8 h-8 flex items-center justify-center rounded text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors"
              >
                <Eye size={14} />
              </Link>
              <Link
                href={`/materials/${m.id}/edit`}
                title="Edit"
                aria-label="Edit materi"
                className="w-8 h-8 flex items-center justify-center rounded text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors"
              >
                <Pencil size={14} />
              </Link>
              <button
                onClick={() => handleDelete(m.id, m.title)}
                disabled={deleting === m.id}
                title="Hapus"
                aria-label="Hapus materi"
                className="w-8 h-8 flex items-center justify-center rounded text-[var(--muted-foreground)] hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors disabled:opacity-50"
              >
                {deleting === m.id ? (
                  <span className="text-xs">…</span>
                ) : (
                  <Trash2 size={14} />
                )}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
