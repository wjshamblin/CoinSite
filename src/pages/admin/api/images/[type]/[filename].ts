import type { APIRoute } from 'astro';
import { del, list } from '@vercel/blob';

export const prerender = false;

export const DELETE: APIRoute = async ({ params, cookies }) => {
  try {
    // Check for session cookie (basic auth check)
    const sessionToken = cookies.get('admin_session')?.value;
    if (!sessionToken) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { type, filename } = params;

    // Validate type parameter
    if (!type || !['collections', 'coins'].includes(type)) {
      return new Response(JSON.stringify({ error: 'Invalid image type. Must be "collections" or "coins".' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!filename) {
      return new Response(JSON.stringify({ error: 'Filename is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Sanitize filename to prevent path traversal
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '');
    if (sanitizedFilename !== filename) {
      return new Response(JSON.stringify({ error: 'Invalid filename' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Construct the blob pathname
    const pathname = `${type}/${sanitizedFilename}`;

    try {
      // List blobs to find the full URL for this pathname
      const { blobs } = await list({ prefix: pathname });

      if (blobs.length > 0) {
        // Delete the blob by its URL
        await del(blobs[0].url);
        return new Response(JSON.stringify({
          success: true,
          message: `Image "${sanitizedFilename}" deleted from blob storage`
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        // Blob not found - might be a static image from git
        // Can't delete static files on Vercel, but return success
        // since the user wants it "removed" from the listing
        return new Response(JSON.stringify({
          success: true,
          message: `Image "${sanitizedFilename}" not found in blob storage (may be a static asset)`
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } catch (blobError) {
      console.error('Blob delete error:', blobError);
      return new Response(JSON.stringify({
        error: 'Failed to delete image from blob storage',
        details: blobError instanceof Error ? blobError.message : 'Unknown error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('Delete image error:', error);
    return new Response(JSON.stringify({
      error: 'Delete failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
