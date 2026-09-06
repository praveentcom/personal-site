import { z } from "zod";

const AppSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  shortDescription: z.string().optional(),
  image: z.string().optional(),
  stack: z.array(z.string()),
  url: z.string().optional(),
  githubUrl: z.string().optional(),
  appStoreUrl: z.string().optional(),
  playStoreUrl: z.string().optional(),
  youtubeVideoId: z.string().optional(),
  coAuthors: z.array(z.string()).optional(),
  actualPrice: z.number().optional(),
  originalPrice: z.number().optional(),
  date: z
    .union([z.string(), z.date()])
    .transform((val) =>
      val instanceof Date ? val.toISOString().slice(0, 10) : val,
    ),
  ogImage: z.string().optional(),
});

export type App = z.infer<typeof AppSchema> & {
  year: string;
  image?: string;
};

export { AppSchema };
