import { defineCollection, reference, z } from "astro:content";

const generateTimestamp = () => new Date();

const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    image: z.string(),

    createdAt: z.date().default(generateTimestamp),

    author: reference("authors"),
    relatedPosts: z.array(reference("blog")).nullable(),
    tags: z.array(reference("tags")),
  }),
});

const tagsCollection = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
    icon: z.string().optional(),
    color: z
      .object({
        background: z.string(),
        text: z.string(),
      })
      .optional(),
  }),
});

const authorsCollection = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    image: z.string(),
    portfolio: z.string(),
  }),
});

export const collections = {
  blog: blogCollection,
  authors: authorsCollection,
  tags: tagsCollection,
};
