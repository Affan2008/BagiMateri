import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

const PAGE_SIZE = 12

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') ?? ''
  const category = searchParams.get('category') ?? ''
  const sort = searchParams.get('sort') ?? 'newest'
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const mine = searchParams.get('mine') === 'true'

  const session = await auth()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: Record<string, any> = mine
    ? { authorId: session?.user?.id }
    : { status: 'PUBLISHED' }

  if (search) {
    where.title = { contains: search }
  }

  if (category) {
    where.category = { slug: category }
  }

  const orderBy =
    sort === 'oldest'
      ? { createdAt: 'asc' as const }
      : sort === 'title'
      ? { title: 'asc' as const }
      : { createdAt: 'desc' as const }

  const [total, materials] = await Promise.all([
    prisma.material.count({ where }),
    prisma.material.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        author: { select: { username: true } },
        category: { select: { name: true, slug: true } },
      },
    }),
  ])

  return NextResponse.json({
    materials,
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil(total / PAGE_SIZE),
  })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, content, categoryId, status } = body

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required.' }, { status: 400 })
    }
    if (!content) {
      return NextResponse.json({ error: 'Content is required.' }, { status: 400 })
    }
    if (!categoryId) {
      return NextResponse.json({ error: 'Category is required.' }, { status: 400 })
    }

    const validStatus = status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT'

    const material = await prisma.material.create({
      data: {
        title: title.trim(),
        content,
        categoryId,
        authorId: session.user.id,
        status: validStatus,
      },
      include: {
        author: { select: { username: true } },
        category: true,
      },
    })

    return NextResponse.json(material, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
