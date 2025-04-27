import { NextResponse } from 'next/server'
import type { FileConvertCallbackRequest } from '@/types/file'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body: FileConvertCallbackRequest = await request.json()
    const { fileId, status, convertedUrl } = body

    const file = await db.file.update({
      where: { id: fileId },
      data: {
        status,
        convertedUrl,
        convertedAt: status === 'SUCCESS' ? new Date() : null,
      },
    })

    return NextResponse.json(file)
  } catch (error) {
    console.error('Error updating file status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 