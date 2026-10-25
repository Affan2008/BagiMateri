import Link from 'next/link'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-4 text-center">
      <FileQuestion size={48} className="mb-4 text-[var(--muted-foreground)] opacity-50" />
      <h1 className="text-3xl font-bold mb-2">Halaman tidak ditemukan</h1>
      <p className="text-[var(--muted-foreground)] mb-6">
        Halaman yang kamu cari tidak ada atau sudah dihapus.
      </p>
      <Link
        href="/"
        className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Ke halaman utama
      </Link>
    </div>
  )
}
