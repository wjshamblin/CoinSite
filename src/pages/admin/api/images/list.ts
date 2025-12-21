import type { APIRoute } from 'astro';
import { list } from '@vercel/blob';

export const prerender = false;

export const GET: APIRoute = async ({ cookies, url }) => {
  // Check authentication
  const sessionToken = cookies.get('admin_session')?.value;
  if (!sessionToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Get optional type filter (coins or collections)
    const typeFilter = url.searchParams.get('type');
    const prefix = typeFilter ? `${typeFilter}/` : undefined;

    // List all blobs from Vercel Blob storage
    const { blobs } = await list({ prefix });

    // Transform blob data to a simpler format
    const images = blobs
      .filter(blob => /\.(jpg|jpeg|png|gif|webp)$/i.test(blob.pathname))
      .map(blob => ({
        url: blob.url,
        pathname: blob.pathname,
        filename: blob.pathname.split('/').pop(),
        type: blob.pathname.startsWith('coins/') ? 'coins' : blob.pathname.startsWith('pages/') ? 'pages' : 'collections',
        size: blob.size,
        uploadedAt: blob.uploadedAt,
      }))
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    return new Response(JSON.stringify({ images }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error listing images:', error);
    return new Response(JSON.stringify({ error: 'Failed to list images' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
