import { auth } from '@clerk/nextjs/server';

interface ClerkTokenResponse {
  jwt: string;
  sessionId: string;
}

export async function getClerkToken(): Promise<ClerkTokenResponse> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Get Clerk session token
  const sessionResponse = await fetch('https://api.clerk.com/v1/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
    },
    body: JSON.stringify({ user_id: userId }),
  });

  if (!sessionResponse.ok) {
    throw new Error('Failed to get session token');
  }

  const sessionData = await sessionResponse.json();
  const sessionId = sessionData.id;

  // Get JWT token
  const tokenResponse = await fetch(
    `https://api.clerk.com/v1/sessions/${sessionId}/tokens`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
      body: JSON.stringify({
        expires_in_seconds: 86400,
      }),
    }
  );

  if (!tokenResponse.ok) {
    throw new Error('Failed to get JWT token');
  }

  const tokenData = await tokenResponse.json();
  return {
    jwt: tokenData.jwt,
    sessionId,
  };
}
