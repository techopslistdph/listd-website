import { auth } from '@clerk/nextjs/server'



export async function GET(request: Request) {
  const { userId, getToken } = await auth();
  const token = await getToken();

  console.log({token, userId})

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const apiKey = searchParams.get('apiKey');
  const apiUrl = searchParams.get('apiUrl');

  if (!apiKey || !apiUrl) {
    return new Response('Missing API key or URL', { status: 400 });
  }

  

}