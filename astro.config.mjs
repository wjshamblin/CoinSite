// @ts-check

import db from '@astrojs/db';
import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',

  // Enable server-side rendering for admin authentication
  output: 'server',

  adapter: vercel(),
  integrations: [db(), mdx(), sitemap()],
  base: process.env.NODE_ENV === 'production' ? '/' : '/',

  vite: {
    plugins: [tailwindcss()],
  },
});