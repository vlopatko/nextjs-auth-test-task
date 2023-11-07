import { NextRequest, NextResponse } from 'next/server'
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const data = await req.json()
  const response = await fetch(
    `https://technical-task-api.icapgroupgmbh.com/api/table/${id}/`,
    {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  )
  const responseData = await response.json()
  return NextResponse.json(responseData)
}
