import { getClerkToken } from '@/lib/auth/clerk';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const url = new URL(request.url);
    let path = url.pathname.replace('/api', '');
    const search = url?.search;
    if (search) {
      const searchParams = new URLSearchParams(search);
      const params = searchParams.toString();
      path += `?${params}`;
    }

    const contentType = request.headers.get('content-type') || '';
    const isFileUpload = contentType.includes('multipart/form-data');

    if (!!session?.userId) {
      const { jwt: token } = await getClerkToken();

      const backendUrl = `${process.env.BACKEND_API_HOST}/api${path}`;

      if (isFileUpload) {
        const formData = await request.formData();
        const response = await fetch(backendUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        const data = await response.json();
        return NextResponse.json(data?.data, { status: response.status });
      } else {
        let body = null;
        try {
          body = await request.json();
        } catch {
          // No body provided, continue without body
        }

        const response = await fetch(backendUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          ...(body && { body: JSON.stringify(body) }),
        });
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
      }
    } else {
      const backendUrl = `${process.env.BACKEND_API_HOST}/api${path}`;

      if (isFileUpload) {
        const formData = await request.formData();
        const response = await fetch(backendUrl, {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
      } else {
        let body = null;
        try {
          body = await request.json();
        } catch {
          // No body provided, continue without body
        }

        const response = await fetch(backendUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          ...(body && { body: JSON.stringify(body) }),
        });
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error);

    // Handle timeout errors specifically
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        {
          error: 'Request timeout',
          message: 'The request took too long to complete. Please try again.',
        },
        { status: 408 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    const url = new URL(request.url);
    let path = url.pathname.replace('/api', '');
    const search = url?.search;

    if (search) {
      const searchParams = new URLSearchParams(search);
      const params = searchParams.toString();
      path += `?${params}`;
    }

    if (!!session?.userId) {
      const { jwt: token } = await getClerkToken();

      const backendUrl = `${process.env.BACKEND_API_HOST}/api${path}`;
      const response = await fetch(backendUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } else {
      const backendUrl = `${process.env.BACKEND_API_HOST}/api${path}`;
      const response = await fetch(backendUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }
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

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { jwt: token } = await getClerkToken();
    const url = new URL(request.url);
    let path = url.pathname.replace('/api', '');
    const search = url?.search;
    if (search) {
      const searchParams = new URLSearchParams(search);
      const params = searchParams.toString();
      path += `?${params}`;
    }

    const backendUrl = `${process.env.BACKEND_API_HOST}/api${path}`;
    const response = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error deleting data:', error);
    return NextResponse.json(
      { error: 'Failed to delete data' },
      { status: 500 }
    );
  }
}
