// @ts-check

import db from '@astrojs/db';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { defineConfig } from 'astro/config';

// Tailwind v4 temporarily disabled - using CSS custom properties instead
// import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',

  // Enable server-side rendering for admin authentication
  output: 'server',

  adapter: vercel(),
  integrations: [db(), mdx(), sitemap()],
  base: process.env.NODE_ENV === 'production' ? '/' : '/',
});