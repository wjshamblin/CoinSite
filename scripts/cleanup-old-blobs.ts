/**
 * Script to delete images from Vercel Blob storage older than 1 week
 *
 * Usage: npx tsx scripts/cleanup-old-blobs.ts [--dry-run]
 *
 * Options:
 *   --dry-run  Show what would be deleted without actually deleting
 */

import { config } from 'dotenv';
import { list, del } from '@vercel/blob';

// Load env vars from .env.local (where Vercel stores pulled env vars)
config({ path: '.env.local' });

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

async function cleanupOldBlobs(dryRun: boolean = false) {
	const cutoffDate = new Date(Date.now() - ONE_WEEK_MS);

	console.log(`Looking for blobs uploaded before: ${cutoffDate.toISOString()}`);
	console.log(dryRun ? '(DRY RUN - no deletions will occur)\n' : '\n');

	let totalDeleted = 0;
	let totalBytes = 0;
	let cursor: string | undefined;

	do {
		const response = await list({ cursor, limit: 100 });

		for (const blob of response.blobs) {
			const uploadedAt = new Date(blob.uploadedAt);

			// Only target coins/ and collections/ directories
			const isTargetDir = blob.pathname.startsWith('coins/') || blob.pathname.startsWith('collections/');

			if (isTargetDir && uploadedAt < cutoffDate) {
				console.log(`[OLD] ${blob.pathname}`);
				console.log(`      Uploaded: ${uploadedAt.toISOString()}`);
				console.log(`      Size: ${(blob.size / 1024).toFixed(2)} KB`);

				if (!dryRun) {
					await del(blob.url);
					console.log(`      DELETED`);
				} else {
					console.log(`      Would delete`);
				}
				console.log('');

				totalDeleted++;
				totalBytes += blob.size;
			}
		}

		cursor = response.cursor;
	} while (cursor);

	console.log('---');
	console.log(`Total blobs ${dryRun ? 'to delete' : 'deleted'}: ${totalDeleted}`);
	console.log(`Total size: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
}

// Check for --dry-run flag
const dryRun = process.argv.includes('--dry-run');

cleanupOldBlobs(dryRun).catch(console.error);
