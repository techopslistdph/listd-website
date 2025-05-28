


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const apiKey = searchParams.get('apiKey');
  const apiUrl = searchParams.get('apiUrl');

  if (!apiKey || !apiUrl) {
    return new Response('Missing API key or URL', { status: 400 });
  }

  

}