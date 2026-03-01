export async function POST(request: Request) {
  try {
    const body = await request.json()
    const token = request.headers.get('authorization')

    const res = await fetch('http://localhost:4000/api/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token || '',
      },
      body: JSON.stringify(body)
    })

    const data = await res.json()
    return Response.json(data) 
  } catch (error) {
    console.error('Chatbot proxy error:', error)
    return Response.json({ error: 'Failed to communicate with AI service' }, { status: 500 })
  }
}
