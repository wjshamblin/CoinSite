import type { APIRoute } from 'astro';
import { db, Collections, Coins, Images, eq } from 'astro:db';

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
      return new Response(JSON.stringify({ error: 'Valid collection ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const collectionId = Number(id);

    // Get all coins in this collection
    const coins = await db.select({ id: Coins.id })
      .from(Coins)
      .where(eq(Coins.collectionId, collectionId));

    const coinIds = coins.map(c => c.id);

    // Delete all images for coins in this collection
    if (coinIds.length > 0) {
      for (const coinId of coinIds) {
        await db.delete(Images).where(eq(Images.coinId, coinId));
      }
    }

    // Delete all coins in this collection
    await db.delete(Coins).where(eq(Coins.collectionId, collectionId));

    // Delete the collection itself
    await db.delete(Collections).where(eq(Collections.id, collectionId));

    return new Response(JSON.stringify({
      success: true,
      message: `Collection deleted successfully`,
      deletedCoins: coinIds.length
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Delete collection error:', error);
    return new Response(JSON.stringify({
      error: 'Delete failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
