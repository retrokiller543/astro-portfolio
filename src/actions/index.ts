import type { BlogPost, Record } from "@/api/BlogClient";
import { ActionError, defineAction, z } from "astro:actions";
import { BLOG_API_BASE_URL } from "astro:env/client";

async function handleFetchResponse(response: Response) {
  if (response.status !== 200) {
    console.error("Error fetching data: " + response.status);
    throw new ActionError({
      message: "Error fetching data",
      code: response.status === 404 ? "NOT_FOUND" : "INTERNAL_SERVER_ERROR",
    });
  }

  const jsonData = await response.json();

  if (typeof jsonData === "undefined") {
    throw new ActionError({
      message: "Internal server error",
      code: "INTERNAL_SERVER_ERROR",
    });
  }

  return jsonData;
}

export const server = {
  getPosts: defineAction({
    handler: async () => {
      const url = new URL(`${BLOG_API_BASE_URL}/blog/posts/`);
      const res = await fetch(url);

      const posts = await handleFetchResponse(res);

      if (!Array.isArray(posts)) {
        throw new ActionError({
          message: "Internal server error",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      return posts;
    },
  }),

  getPostById: defineAction({
    input: z.object({
      id: z.string(),
    }),
    handler: async ({ id }) => {
      const url = new URL(`${BLOG_API_BASE_URL}/blog/posts/${id}`);
      const res = await fetch(url);

      const post: BlogPost = await handleFetchResponse(res);

      return post;
    },
  }),

  createPost: defineAction({
    accept: "form",
    input: z.object({
      title: z.string(),
      content: z.string(),
      accessToken: z.string(),
    }),
    handler: async ({ title, content, accessToken }) => {
      const url = new URL(`${BLOG_API_BASE_URL}/blog/posts/`);
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      const post: Record = await handleFetchResponse(res);

      return post;
    },
  }),
};
