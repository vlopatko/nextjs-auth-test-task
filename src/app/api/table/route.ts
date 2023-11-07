import { User } from '@/components/Table'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.nextUrl)
  const response = await fetch(
    `https://technical-task-api.icapgroupgmbh.com/api/table/?limit=${searchParams.get(
      'limit'
    )}&offset=${searchParams.get('offset')}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  const users: User[] = await response.json()

  return NextResponse.json(users)
}
