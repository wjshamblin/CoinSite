import type { APIRoute } from 'astro';
import { db, Coins, Images, eq } from 'astro:db';

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

    const id = params.id;

    if (!id || isNaN(Number(id))) {
      return new Response(JSON.stringify({ error: 'Valid coin ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const coinId = Number(id);

    // Delete all images for this coin
    await db.delete(Images).where(eq(Images.coinId, coinId));

    // Delete the coin itself
    await db.delete(Coins).where(eq(Coins.id, coinId));

    return new Response(JSON.stringify({
      success: true,
      message: 'Coin deleted successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Delete coin error:', error);
    return new Response(JSON.stringify({
      error: 'Delete failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
