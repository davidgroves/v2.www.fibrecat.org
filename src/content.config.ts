import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z
      .string()
      .or(z.date())
      .transform((val) => new Date(val)),
    updatedDate: z
      .string()
      .optional()
      .transform((str) => (str ? new Date(str) : undefined)),
    heroImage: image().optional(),
    heroAltText: z.string().optional(),
    heroLink: z.string().optional(),
    heroCredit: z.string().optional(),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { blog };
