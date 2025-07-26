import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'Secret endpoint discovered!',
    key: 'NETWORK_ANALYSIS_SUCCESS',
    points: 20,
    hint: 'You found the hidden API endpoint through network analysis!',
  })
}

export async function POST() {
  return NextResponse.json({
    error: 'Method not allowed for this endpoint',
  }, { status: 405 })
}
