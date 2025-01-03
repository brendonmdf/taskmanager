import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json()
    const { id } = params

    await sql`
      UPDATE tasks
      SET status = ${status}
      WHERE id = ${id}
    `

    return NextResponse.json({ message: 'Task updated successfully' })
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

