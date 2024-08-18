import { fileURLToPath, URL } from "node:url";
import { defineConfig, envField } from "astro/config";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import icon from "astro-icon";
import vue from "@astrojs/vue";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel/serverless";
import react from "@astrojs/react";

import sentry from "@sentry/astro";
import spotlightjs from "@spotlightjs/astro";

// https://astro.build/config
export default defineConfig({
  //base: import.meta.env.PROD ? "https://astro-portfolio-nine-puce.vercel.app" : "http://localhost:4321",
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport"
  },
  output: "hybrid",
  experimental: {
    serverIslands: true,
    env: {
      schema: {
        API_BASE_URL: envField.string({
          context: "client",
          access: "public",
          default: "http://localhost:6968"
        }),
        BLOG_API_BASE_URL: envField.string({
          context: "client",
          access: "public",
          default: "http://localhost:7856"
        })
      }
    }
  },
  site: import.meta.env.PROD ? "https://astro-portfolio-nine-puce.vercel.app" : "http://localhost:4321",
  integrations: [wasm(), icon(), vue({
    appEntrypoint: "/src/_app",
    compilerOptions: {
      isCustomElement: tag => tag.startsWith("Ion-")
    },
    devtools: false
  }), sitemap(), react(), sentry(), spotlightjs()],
  vite: {
    plugins: [wasm(), topLevelAwait()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url))
      }
    }
  },
  adapter: vercel()
});