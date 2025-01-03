import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { getServerSession } from "next-auth/next"
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const result = await sql`
      SELECT name, email, avatar_url FROM users
      WHERE email = ${session.user.email}
    `

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      name: result.rows[0].name,
      email: result.rows[0].email,
      avatarUrl: result.rows[0].avatar_url,
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { name, email, password } = await request.json()

    let updateQuery = sql`
      UPDATE users
      SET name = ${name}, email = ${email}
    `

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      updateQuery = sql`
        ${updateQuery}, password = ${hashedPassword}
      `
    }

    updateQuery = sql`
      ${updateQuery}
      WHERE email = ${session.user.email}
    `

    await updateQuery

    return NextResponse.json({ message: 'Profile updated successfully' })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

