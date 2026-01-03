import type { APIRoute } from 'astro';

export const prerender = false;

// This endpoint handles the Vercel Blob client upload callback
// Used by @vercel/blob/client upload() function
export const POST: APIRoute = async ({ request, cookies }) => {
  // Check for session cookie (basic auth check)
  const sessionToken = cookies.get('admin_session')?.value;
  if (!sessionToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Dynamic import to avoid bundling issues
    const { handleUpload } = await import('@vercel/blob/client');

    const body = await request.json();

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname: string) => {
        // Validate the upload path
        const validPrefixes = ['coins/', 'collections/', 'pages/'];
        const isValid = validPrefixes.some(prefix => pathname.startsWith(prefix));

        if (!isValid) {
          throw new Error('Invalid upload path');
        }

        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
          maximumSizeInBytes: 10 * 1024 * 1024, // 10MB max
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log('Upload completed:', blob.pathname);
      },
    });

    return new Response(JSON.stringify(jsonResponse), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Upload URL error:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Failed to generate upload URL'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
