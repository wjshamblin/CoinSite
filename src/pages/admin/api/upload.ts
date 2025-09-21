import type { APIRoute } from 'astro';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const type = formData.get('type') as string; // 'collections' or 'coins'

    if (!files || files.length === 0) {
      return new Response(JSON.stringify({ error: 'No files provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!type || !['collections', 'coins'].includes(type)) {
      return new Response(JSON.stringify({ error: 'Invalid upload type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const uploadDir = join(process.cwd(), 'public', 'images', type);

    // Ensure directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    const uploadedFiles = [];
    const errors = [];

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
        const fileName = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, '-');
        const filePath = join(uploadDir, fileName);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        await writeFile(filePath, buffer);
        uploadedFiles.push(fileName);
      } catch (error) {
        errors.push(`${file.name}: Failed to save file.`);
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
    return new Response(JSON.stringify({ error: 'Upload failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};