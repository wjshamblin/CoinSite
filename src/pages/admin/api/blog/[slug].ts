import type { APIRoute } from 'astro';
import { unlink } from 'node:fs/promises';
import { join } from 'node:path';

export const prerender = false;

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const slug = params.slug;

    if (!slug) {
      return new Response(JSON.stringify({ error: 'Slug is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Blog posts are stored as files in src/content/blog/
    // Try both .md and .mdx extensions
    const mdFilePath = join(process.cwd(), 'src', 'content', 'blog', `${slug}.md`);
    const mdxFilePath = join(process.cwd(), 'src', 'content', 'blog', `${slug}.mdx`);

    let fileDeleted = false;
    try {
      // Try to delete .md file first
      await unlink(mdFilePath);
      fileDeleted = true;
    } catch (error) {
      // If .md doesn't exist, try .mdx
      try {
        await unlink(mdxFilePath);
        fileDeleted = true;
      } catch (mdxError) {
        // Neither file exists
        fileDeleted = false;
      }
    }

    if (fileDeleted) {
      return new Response(JSON.stringify({
        success: true,
        message: `Blog post "${slug}" deleted successfully`
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({
        error: 'Blog post not found or could not be deleted'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('Delete blog post error:', error);
    return new Response(JSON.stringify({ error: 'Delete failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};