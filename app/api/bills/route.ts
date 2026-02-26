import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const token = new Headers().get('authorization') // Wait, need to get from request
    // Actually, since it's API route, headers are in request
    // But for simplicity, since auth is in token, but in frontend, Authorization header is set.

    // The fetch in bills page: fetch('/api/bills', { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })

    // So, the request has Authorization header.

    // To proxy, need to forward the request to localhost:4000

    const response = await fetch('http://localhost:4000/api/bills', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Forward Authorization
        'Authorization': request.headers.get('authorization') || '',
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const response = await fetch('http://localhost:4000/api/bills', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('authorization') || '',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
