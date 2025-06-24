import { getClerkToken } from '@/lib/auth/clerk';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { jwt: token } = await getClerkToken();

    // Extract the path from the request URL
    const url = new URL(request.url);
    const path = url.pathname.replace('/api', '');

    // Forward the request to the backend
    const backendUrl = `${process.env.BACKEND_API_HOST}/api${path}`;
    const response = await fetch(backendUrl, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { jwt: token } = await getClerkToken();

    // Extract the path from the request URL
    const url = new URL(request.url);
    const path = url.pathname.replace('/api', '');

    // Get the request body
    const body = await request.json();

    // Forward the request to the backend
    const backendUrl = `${process.env.BACKEND_API_HOST}/api${path}`;

    const response = await fetch(backendUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error updating data:', error);
    return NextResponse.json(
      { error: 'Failed to update data' },
      { status: 500 }
    );
  }
}
