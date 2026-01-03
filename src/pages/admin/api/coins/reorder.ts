import type { APIRoute } from 'astro';
import { db, Coins, eq } from 'astro:db';
import { requireAuth, isRedirect } from '../../../../lib/authMiddleware';

export const prerender = false;

export const POST: APIRoute = async (context) => {
	// Check authentication
	const authResult = await requireAuth(context);
	if (isRedirect(authResult)) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		const body = await context.request.json();
		const { coinOrder } = body;

		if (!Array.isArray(coinOrder)) {
			return new Response(JSON.stringify({ error: 'Invalid coin order format' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Update each coin's sortOrder
		for (let i = 0; i < coinOrder.length; i++) {
			const coinId = coinOrder[i];
			await db.update(Coins)
				.set({ sortOrder: i })
				.where(eq(Coins.id, coinId));
		}

		return new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Error reordering coins:', error);
		return new Response(JSON.stringify({ error: 'Failed to reorder coins' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
