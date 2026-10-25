'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Globe, Eye, EyeOff } from 'lucide-react'
import { KatexRenderer } from '@/components/KatexRenderer'

const TiptapEditor = dynamic(
  () => import('@/components/TiptapEditor').then((m) => m.TiptapEditor),
  {
    ssr: false,
    loading: () => (
      <div className="tiptap-editor flex items-center justify-center min-h-[200px] text-[var(--muted-foreground)] text-sm">
        Memuat editor…
      </div>
    ),
  }
)

interface Category {
  id: string
  name: string
  slug: string
}

interface EditorFormProps {
  categories: Category[]
  initialTitle?: string
  initialContent?: string
  initialCategoryId?: string
  materialId?: string
}

export function EditorForm({
  categories,
  initialTitle = '',
  initialContent = '',
  initialCategoryId = '',
  materialId,
}: EditorFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [categoryId, setCategoryId] = useState(
    initialCategoryId || (categories[0]?.id ?? '')
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(false)

  const save = async (status: 'DRAFT' | 'PUBLISHED') => {
    setError('')
    if (!title.trim()) { setError('Harap masukkan judul materi.'); return }
    if (!content || content === '<p></p>') { setError('Harap tambahkan isi konten.'); return }
    if (!categoryId) { setError('Harap pilih kategori.'); return }

    setSaving(true)
    try {
      const url = materialId ? `/api/materials/${materialId}` : '/api/materials'
      const method = materialId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, categoryId, status }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Terjadi kesalahan.')
        return
      }

      if (status === 'PUBLISHED') {
        router.push(`/materials/${data.id}`)
      } else {
        router.push('/my-materials')
      }
    } catch {
      setError('Gagal terhubung ke server. Coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-4 px-4 py-3 rounded-md bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Title */}
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium mb-1.5">
          Judul
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Masukkan judul materi…"
          maxLength={200}
          className="w-full px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>

      {/* Category */}
      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium mb-1.5">
          Kategori
        </label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Preview toggle */}
      <div className="mb-4 flex items-center justify-between">
        <label className="text-sm font-medium">Konten</label>
        <button
          type="button"
          onClick={() => setPreview(!preview)}
          className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        >
          {preview ? <EyeOff size={14} /> : <Eye size={14} />}
          {preview ? 'Edit' : 'Pratinjau'}
        </button>
      </div>

      {preview ? (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5 min-h-[400px]">
          {content && content !== '<p></p>' ? (
            <KatexRenderer html={content} />
          ) : (
            <p className="text-[var(--muted-foreground)] italic">Belum ada konten untuk dipratinjau.</p>
          )}
        </div>
      ) : (
        <TiptapEditor content={content} onChange={setContent} />
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mt-6">
        <button
          type="button"
          onClick={() => save('DRAFT')}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 border border-[var(--border)] rounded-md text-sm font-medium hover:bg-[var(--secondary)] transition-colors disabled:opacity-50"
        >
          <Save size={14} />
          {saving ? 'Menyimpan…' : 'Simpan Draft'}
        </button>
        <button
          type="button"
          onClick={() => save('PUBLISHED')}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Globe size={14} />
          {saving ? 'Menerbitkan…' : 'Terbitkan'}
        </button>
      </div>
    </div>
  )
}
