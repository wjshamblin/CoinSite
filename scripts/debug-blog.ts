// Debug script to check blog post properties
import { getCollection } from 'astro:content';

const posts = await getCollection('blog');

console.log('=== Blog Post Properties ===\n');

for (const post of posts) {
  console.log('Post:', post.data.title);
  console.log('  id:', post.id);
  console.log('  slug:', post.slug);
  console.log('  collection:', post.collection);
  console.log('  Keys:', Object.keys(post));
  console.log('');
}
