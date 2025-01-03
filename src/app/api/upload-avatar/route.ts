import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { getServerSession } from "next-auth/next"
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('avatar') as File
    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save the file
    const fileName = `${Date.now()}_${file.name}`
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName)
    await writeFile(filePath, buffer)

    // Update the user's avatar URL in the database
    const avatarUrl = `/uploads/${fileName}`
    await sql`
      UPDATE users
      SET avatar_url = ${avatarUrl}
      WHERE email = ${session.user.email}
    `

    return NextResponse.json({ avatarUrl })
  } catch (error) {
    console.error('Error uploading avatar:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

