import type { APIRoute } from 'astro';
import { unlink } from 'node:fs/promises';
import { join } from 'node:path';

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

    // Construct the file path
    const imagePath = join(process.cwd(), 'public', 'images', type, sanitizedFilename);

    try {
      await unlink(imagePath);
      return new Response(JSON.stringify({
        success: true,
        message: `Image "${sanitizedFilename}" deleted successfully`
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (unlinkError) {
      // File doesn't exist or can't be deleted
      return new Response(JSON.stringify({
        error: 'Image not found or could not be deleted',
        details: unlinkError instanceof Error ? unlinkError.message : 'Unknown error'
      }), {
        status: 404,
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
