#!/usr/bin/env npx tsx
/**
 * Migration Script: Upload existing images to Vercel Blob
 *
 * This script:
 * 1. Scans public/images/coins/ and public/images/collections/
 * 2. Uploads each image to Vercel Blob storage
 * 3. Updates the database with the new blob URLs
 *
 * Usage:
 *   npx tsx scripts/migrate-images-to-blob.ts [--dry-run]
 *
 * Environment variables required:
 *   - BLOB_READ_WRITE_TOKEN (from Vercel)
 *   - ASTRO_DB_REMOTE_URL (Turso database URL)
 *   - ASTRO_DB_APP_TOKEN (Turso auth token)
 */

import { put, list } from '@vercel/blob';
import { createClient } from '@libsql/client';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

const DRY_RUN = process.argv.includes('--dry-run');

// Validate environment variables
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const DB_URL = process.env.ASTRO_DB_REMOTE_URL;
const DB_TOKEN = process.env.ASTRO_DB_APP_TOKEN;

if (!BLOB_TOKEN) {
  console.error('Error: BLOB_READ_WRITE_TOKEN not set');
  process.exit(1);
}

if (!DB_URL || !DB_TOKEN) {
  console.error('Error: ASTRO_DB_REMOTE_URL or ASTRO_DB_APP_TOKEN not set');
  process.exit(1);
}

// Initialize database client
const db = createClient({
  url: DB_URL,
  authToken: DB_TOKEN,
});

interface MigrationResult {
  filename: string;
  type: 'coins' | 'collections';
  blobUrl: string;
  status: 'uploaded' | 'skipped' | 'error';
  error?: string;
}

const results: MigrationResult[] = [];

async function getExistingBlobs(): Promise<Set<string>> {
  const existing = new Set<string>();

  try {
    // List all blobs to check what's already uploaded
    const { blobs } = await list({ token: BLOB_TOKEN });
    for (const blob of blobs) {
      // Extract pathname from URL
      const pathname = blob.pathname;
      existing.add(pathname);
    }
    console.log(`Found ${existing.size} existing blobs in storage`);
  } catch (error) {
    console.warn('Warning: Could not list existing blobs:', error);
  }

  return existing;
}

async function uploadImage(
  filePath: string,
  type: 'coins' | 'collections',
  filename: string,
  existingBlobs: Set<string>
): Promise<MigrationResult> {
  const pathname = `${type}/${filename}`;

  // Check if already uploaded
  if (existingBlobs.has(pathname)) {
    return {
      filename,
      type,
      blobUrl: '', // Will be filled in later if needed
      status: 'skipped',
    };
  }

  if (DRY_RUN) {
    console.log(`[DRY RUN] Would upload: ${pathname}`);
    return {
      filename,
      type,
      blobUrl: `https://example.blob.vercel-storage.com/${pathname}`,
      status: 'uploaded',
    };
  }

  try {
    const fileBuffer = await readFile(filePath);
    const blob = await put(pathname, fileBuffer, {
      access: 'public',
      addRandomSuffix: false,
      token: BLOB_TOKEN,
    });

    console.log(`✓ Uploaded: ${pathname} -> ${blob.url}`);

    return {
      filename,
      type,
      blobUrl: blob.url,
      status: 'uploaded',
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`✗ Failed to upload ${pathname}: ${errorMsg}`);

    return {
      filename,
      type,
      blobUrl: '',
      status: 'error',
      error: errorMsg,
    };
  }
}

async function updateDatabase(results: MigrationResult[]): Promise<void> {
  const uploadedCoins = results.filter(r => r.type === 'coins' && r.status === 'uploaded');
  const uploadedCollections = results.filter(r => r.type === 'collections' && r.status === 'uploaded');

  console.log('\n--- Updating Database ---');

  // Update Coins table (primaryImage field)
  for (const result of uploadedCoins) {
    if (DRY_RUN) {
      console.log(`[DRY RUN] Would update Coins where primaryImage = '${result.filename}' to '${result.blobUrl}'`);
      continue;
    }

    try {
      const updateResult = await db.execute({
        sql: 'UPDATE Coins SET primaryImage = ? WHERE primaryImage = ?',
        args: [result.blobUrl, result.filename],
      });

      if (updateResult.rowsAffected > 0) {
        console.log(`✓ Updated ${updateResult.rowsAffected} coin(s) with primaryImage: ${result.filename}`);
      }
    } catch (error) {
      console.error(`✗ Failed to update Coins for ${result.filename}:`, error);
    }
  }

  // Update Images table (filename field)
  for (const result of uploadedCoins) {
    if (DRY_RUN) {
      console.log(`[DRY RUN] Would update Images where filename = '${result.filename}' to '${result.blobUrl}'`);
      continue;
    }

    try {
      const updateResult = await db.execute({
        sql: 'UPDATE Images SET filename = ? WHERE filename = ?',
        args: [result.blobUrl, result.filename],
      });

      if (updateResult.rowsAffected > 0) {
        console.log(`✓ Updated ${updateResult.rowsAffected} image(s) with filename: ${result.filename}`);
      }
    } catch (error) {
      console.error(`✗ Failed to update Images for ${result.filename}:`, error);
    }
  }

  // Update Collections table (thumbnail field)
  for (const result of uploadedCollections) {
    if (DRY_RUN) {
      console.log(`[DRY RUN] Would update Collections where thumbnail = '${result.filename}' to '${result.blobUrl}'`);
      continue;
    }

    try {
      const updateResult = await db.execute({
        sql: 'UPDATE Collections SET thumbnail = ? WHERE thumbnail = ?',
        args: [result.blobUrl, result.filename],
      });

      if (updateResult.rowsAffected > 0) {
        console.log(`✓ Updated ${updateResult.rowsAffected} collection(s) with thumbnail: ${result.filename}`);
      }
    } catch (error) {
      console.error(`✗ Failed to update Collections for ${result.filename}:`, error);
    }
  }

  // Also update collections that use coins/ prefix thumbnails
  for (const result of uploadedCoins) {
    const coinsPrefix = `coins/${result.filename}`;
    if (DRY_RUN) {
      console.log(`[DRY RUN] Would update Collections where thumbnail = '${coinsPrefix}' to '${result.blobUrl}'`);
      continue;
    }

    try {
      const updateResult = await db.execute({
        sql: 'UPDATE Collections SET thumbnail = ? WHERE thumbnail = ?',
        args: [result.blobUrl, coinsPrefix],
      });

      if (updateResult.rowsAffected > 0) {
        console.log(`✓ Updated ${updateResult.rowsAffected} collection(s) with thumbnail: ${coinsPrefix}`);
      }
    } catch (error) {
      // Silently ignore - most won't match
    }
  }
}

async function scanAndUploadDirectory(
  dirPath: string,
  type: 'coins' | 'collections',
  existingBlobs: Set<string>
): Promise<void> {
  try {
    const files = await readdir(dirPath);
    const imageFiles = files.filter(f =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(f)
    );

    console.log(`\nFound ${imageFiles.length} images in ${type}/`);

    for (const filename of imageFiles) {
      const filePath = join(dirPath, filename);
      const result = await uploadImage(filePath, type, filename, existingBlobs);
      results.push(result);
    }
  } catch (error) {
    console.error(`Error scanning ${dirPath}:`, error);
  }
}

async function main(): Promise<void> {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     Migrate Existing Images to Vercel Blob Storage         ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  if (DRY_RUN) {
    console.log('\n🔍 DRY RUN MODE - No changes will be made\n');
  }

  // Get existing blobs to avoid re-uploading
  const existingBlobs = await getExistingBlobs();

  // Scan and upload images
  const coinsDir = join(process.cwd(), 'public', 'images', 'coins');
  const collectionsDir = join(process.cwd(), 'public', 'images', 'collections');

  await scanAndUploadDirectory(coinsDir, 'coins', existingBlobs);
  await scanAndUploadDirectory(collectionsDir, 'collections', existingBlobs);

  // Update database with new URLs
  await updateDatabase(results);

  // Print summary
  console.log('\n════════════════════════════════════════════════════════════');
  console.log('                        SUMMARY                              ');
  console.log('════════════════════════════════════════════════════════════');

  const uploaded = results.filter(r => r.status === 'uploaded').length;
  const skipped = results.filter(r => r.status === 'skipped').length;
  const errors = results.filter(r => r.status === 'error').length;

  console.log(`✓ Uploaded: ${uploaded}`);
  console.log(`⏭ Skipped (already exists): ${skipped}`);
  console.log(`✗ Errors: ${errors}`);

  if (errors > 0) {
    console.log('\nErrors:');
    results
      .filter(r => r.status === 'error')
      .forEach(r => console.log(`  - ${r.type}/${r.filename}: ${r.error}`));
  }

  if (DRY_RUN) {
    console.log('\n🔍 This was a dry run. Run without --dry-run to apply changes.');
  }
}

main().catch(console.error);
