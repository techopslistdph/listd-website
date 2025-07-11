import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the lock parameter from URL, default to true if not provided
    const url = new URL(request.url);
    const ban = url.searchParams.get('ban') ?? 'true';

    // Call Clerk API to lock user account
    const response = await fetch(
      `https://api.clerk.com/v1/users/${userId}/${ban ? 'ban' : 'unban'}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Clerk API error:', errorData);
      return NextResponse.json(
        {
          success: false,
          message:
            errorData.errors?.[0]?.longMessage || 'Failed to lock account',
        },
        { status: response.status }
      );
    }

    // const responseData = await response.json();

    const action = ban === 'true' ? 'banned' : 'unbanned';
    return NextResponse.json(
      { success: true, message: `Account ${action} successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error locking account:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
