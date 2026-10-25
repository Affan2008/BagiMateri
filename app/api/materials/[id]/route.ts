import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

interface Params {
  params: { id: string }
}

export async function GET(_req: NextRequest, { params }: Params) {
  const material = await prisma.material.findUnique({
    where: { id: params.id },
    include: {
      author: { select: { username: true } },
      category: { select: { name: true, slug: true } },
    },
  })

  if (!material) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  }

  // For drafts, only the owner can view
  if (material.status === 'DRAFT') {
    const session = await auth()
    if (session?.user?.id !== material.authorId) {
      return NextResponse.json({ error: 'Not found.' }, { status: 404 })
    }
  }

  return NextResponse.json(material)
}

export async function PUT(request: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const material = await prisma.material.findUnique({
    where: { id: params.id },
  })

  if (!material) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  }

  if (material.authorId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
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

    const updated = await prisma.material.update({
      where: { id: params.id },
      data: {
        title: title.trim(),
        content,
        categoryId,
        status: validStatus,
      },
      include: {
        author: { select: { username: true } },
        category: true,
      },
    })

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const material = await prisma.material.findUnique({
    where: { id: params.id },
  })

  if (!material) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  }

  if (material.authorId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
  }

  await prisma.material.delete({ where: { id: params.id } })

  return NextResponse.json({ message: 'Deleted.' })
}
