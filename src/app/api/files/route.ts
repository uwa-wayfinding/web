import { NextResponse } from 'next/server'
    import { getUser } from '@/lib/auth-server'
import { isNullish } from 'remeda'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const user = await getUser  ()
    if (isNullish(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const files = await db.file.findMany({  
      where: {
        userId: user.id,
      },
    })

    return NextResponse.json(files)
  } catch (error) {
    console.error('Error fetching files:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 