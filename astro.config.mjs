// @ts-check

import db from '@astrojs/db';
import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
    site: 'https://example.com',
    output: 'server', // Enable server-side rendering for admin authentication
    adapter: vercel(),
    integrations: [db(), mdx(), sitemap()],
    base: process.env.NODE_ENV === 'production' ? '/' : '/',
});