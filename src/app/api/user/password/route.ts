import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          message: 'Current password and new password are required',
        },
        { status: 400 }
      );
    }

    // First, verify the current password using Clerk's verify_password endpoint
    const verifyResponse = await fetch(
      `https://api.clerk.com/v1/users/${userId}/verify_password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
        body: JSON.stringify({
          password: currentPassword,
        }),
      }
    );

    if (!verifyResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          message: 'Current password is incorrect',
        },
        { status: 400 }
      );
    }

    // If current password is correct, proceed to update the password
    const updateResponse = await fetch(
      `https://api.clerk.com/v1/users/${userId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
        body: JSON.stringify({
          password: newPassword,
        }),
      }
    );

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      console.error('Clerk API error:', errorData);
      return NextResponse.json(
        {
          success: false,
          message:
            errorData.errors?.[0]?.longMessage || 'Failed to update password',
        },
        { status: updateResponse.status }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Password updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
