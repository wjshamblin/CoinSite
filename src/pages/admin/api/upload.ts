import type { APIRoute } from 'astro';
import { put } from '@vercel/blob';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Check for session cookie (basic auth check)
    const sessionToken = cookies.get('admin_session')?.value;
    if (!sessionToken) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const type = formData.get('type') as string; // 'collections' or 'coins'

    if (!files || files.length === 0) {
      return new Response(JSON.stringify({ error: 'No files provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!type || !['collections', 'coins', 'pages'].includes(type)) {
      return new Response(JSON.stringify({ error: 'Invalid upload type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const uploadedFiles: Array<{ filename: string; url: string }> = [];
    const errors: string[] = [];

    for (const file of files) {
      if (!(file instanceof File)) continue;

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: Invalid file type. Only images are allowed.`);
        continue;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        errors.push(`${file.name}: File too large. Maximum size is 5MB.`);
        continue;
      }

      try {
        // Sanitize filename
        const filename = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, '-');
        // Create path like: coins/coin-name.png or collections/collection-name.png
        const pathname = `${type}/${filename}`;

        // Upload to Vercel Blob
        // addRandomSuffix: true ensures unique filenames to avoid conflicts
        const blob = await put(pathname, file, {
          access: 'public',
          addRandomSuffix: true,
        });

        uploadedFiles.push({
          filename: blob.pathname, // Use the actual stored pathname (includes random suffix)
          url: blob.url
        });
      } catch (error) {
        console.error(`Upload error for ${file.name}:`, error);
        errors.push(`${file.name}: Failed to upload file.`);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      uploadedFiles,
      errors,
      message: `Successfully uploaded ${uploadedFiles.length} file(s)${errors.length > 0 ? ` with ${errors.length} error(s)` : ''}`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({
      error: 'Upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
