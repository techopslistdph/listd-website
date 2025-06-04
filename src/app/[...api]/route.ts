import { NextResponse } from 'next/server'

const BACKEND_API_HOST = process.env.BACKEND_API_HOST || 'http://localhost:3001'
const BACKEND_API_VERSION = process.env.BACKEND_API_VERSION || 'v1'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const pathname = url.pathname.replace('/api', `/api/${BACKEND_API_VERSION}`)
    const backendUrl = new URL(pathname, BACKEND_API_HOST)
    backendUrl.search = url.search

    console.log({backendUrl})
    
    const response = await fetch(backendUrl.toString(), {
      method: 'GET',
      headers: {
        ...Object.fromEntries(request.headers),
      },
    })
    
    const data = await response.json()
    
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}