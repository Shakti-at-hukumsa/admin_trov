import { NextResponse } from 'next/server'
import { fetchAgentsServer } from '@/lib/api'

export const revalidate = 60 // Revalidate every 60 seconds

export async function GET() {
  try {
    const agents = await fetchAgentsServer()
    //console.log("agents", agents)
    return NextResponse.json(agents)
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    )
  }
}


