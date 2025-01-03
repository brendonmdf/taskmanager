import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export async function GET() {
  try {
    const result = await sql`
      SELECT * FROM chats
      ORDER BY created_at DESC
    `

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching chats:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, isGroup } = await request.json()

    const result = await sql`
      INSERT INTO chats (name, is_group)
      VALUES (${name}, ${isGroup})
      RETURNING *
    `

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error creating chat:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

