import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export async function GET() {
  try {
    const result = await sql`
      SELECT * FROM tasks
      ORDER BY created_at DESC
    `

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

