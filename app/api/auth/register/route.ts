import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required.' },
        { status: 400 }
      )
    }

    const trimmed = username.trim()
    if (trimmed.length < 3 || trimmed.length > 32) {
      return NextResponse.json(
        { error: 'Username must be between 3 and 32 characters.' },
        { status: 400 }
      )
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      return NextResponse.json(
        { error: 'Username may only contain letters, numbers, and underscores.' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters.' },
        { status: 400 }
      )
    }

    const usernameLower = trimmed.toLowerCase()

    const existing = await prisma.user.findUnique({
      where: { usernameLower },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'That username is already taken.' },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        username: trimmed,
        usernameLower,
        passwordHash,
      },
    })

    return NextResponse.json(
      { message: 'Account created.', userId: user.id },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    )
  }
}
