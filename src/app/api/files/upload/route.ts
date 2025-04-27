import { NextResponse } from 'next/server'
import type { FileUploadRequest } from '@/types/file'
import { getUser } from '@/lib/auth-server'
import { isNullish } from 'remeda'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const user = await getUser()    

    const body: FileUploadRequest = await request.json()
    const { originalUrl } = body


    if (isNullish(user)) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const file = await db.file.create({
      data: {
        userId: user.id,
        originalUrl,
        status: 'UPLOADING',
      },
    })

    return NextResponse.json(file)
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 