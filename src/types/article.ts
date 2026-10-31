import { z } from "zod";

const ArticleSchema = z.object({
  title: z.string(),
  emoji: z.string().trim().min(1).optional(),
  description: z.string(),
  date: z.iso.date(),
  tags: z.array(z.string()),
  categories: z.array(z.string()).default([]),
  published: z.boolean().default(true),
  private: z.boolean().optional(),
  image: z.string().optional(),
  ogImage: z.string().optional(),
});

export type Article = z.infer<typeof ArticleSchema> & {
  slug: string;
  readTime: number;
  content: string;
  image: string;
};

export { ArticleSchema };
