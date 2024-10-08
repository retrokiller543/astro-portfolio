import { fileURLToPath, URL } from "node:url";
import { defineConfig, envField } from "astro/config";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import vue from "@astrojs/vue";
import sitemap from "@astrojs/sitemap";
import vercelServerless from "@astrojs/vercel/serverless";
import react from "@astrojs/react";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  //base: import.meta.env.PROD ? "https://astro-portfolio-nine-puce.vercel.app" : "http://localhost:4321",
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  output: "hybrid",
  experimental: {
    actions: true,
    serverIslands: true,
    env: {
      schema: {
        API_BASE_URL: envField.string({
          context: "client",
          access: "public",
          default: "http://localhost:6968",
        }),
        BLOG_API_BASE_URL: envField.string({
          context: "client",
          access: "public",
          default: "http://localhost:7856",
        }),
      },
    },
  },
  site: import.meta.env.PROD ? "https://astro-portfolio-nine-puce.vercel.app" : "http://localhost:4321",
  //site: "https://shielded-rust-web.netlify.app",
  integrations: [
    wasm(),
    topLevelAwait(),
    vue({
      appEntrypoint: "/src/_app",
      compilerOptions: {
        isCustomElement: (tag) => tag.startsWith("Ion-"),
      },
      devtools: false,
    }),
    sitemap(),
    react(),
    mdx(),
  ],
  vite: {
    //plugins: [wasm(), topLevelAwait()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
  adapter: vercelServerless({
    edgeMiddleware: true,
    imageService: true,
    devImageService: "sharp",
    imagesConfig: {
      sizes: [320, 640, 750, 828, 1080, 1200],
      dangerouslyAllowSVG: true,
      formats: ["image/avif", "image/webp"],
      domains: ["https://bulma.io"],
      remotePatterns: [
        {
          protocol: "https",
          hostname: "^bulma\\.io$",
          pathname: "**",
        },
      ],
    },
    functionPerRoute: false,
    isr: true,
  }),
});
