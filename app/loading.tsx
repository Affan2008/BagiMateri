export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 text-center text-[var(--muted-foreground)]">
      <div className="inline-block w-6 h-6 border-2 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin mb-4" />
      <p className="text-sm">Memuat…</p>
    </div>
  )
}
