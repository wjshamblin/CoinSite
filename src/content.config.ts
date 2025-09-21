import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
		}),
});

// Collection metadata for enhanced content management
const collectionContent = defineCollection({
	loader: glob({ base: './src/content/collections', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			thumbnail: image(),
			featured: z.boolean().default(false),
			coinCount: z.number().optional(),
			era: z.string().optional(),
			origin: z.string().optional(),
		}),
});

// Individual coin content for detailed descriptions
const coins = defineCollection({
	loader: glob({ base: './src/content/coins', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			collection: z.string(), // References collection slug
			year: z.number().optional(),
			mintage: z.string().optional(),
			condition: z.string().optional(),
			denomination: z.string().optional(),
			composition: z.string().optional(),
			diameter: z.string().optional(),
			weight: z.string().optional(),
			primaryImage: image(),
			featured: z.boolean().default(false),
		}),
});

export const collections = { blog, collectionContent, coins };
