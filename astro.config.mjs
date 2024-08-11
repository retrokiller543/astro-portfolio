import { fileURLToPath, URL } from 'node:url';
import { defineConfig, envField } from 'astro/config';
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import icon from "astro-icon";
import vue from "@astrojs/vue";
import sitemap from "@astrojs/sitemap";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  //base: import.meta.env.PROD ? 'https://astro-portfolio-nine-puce.vercel.app/' : '/',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  },
  output: 'hybrid',
  experimental: {
    serverIslands: true,
    env: {
      schema: {
        API_BASE_URL: envField.string({context: 'client', access: 'public', default: 'http://localhost:6968'})
      }
    }
  },
  site: 'https://shielded-rust-web.netlify.app',
  integrations: [wasm(), icon(), vue({
    appEntrypoint: '/src/_app',
    compilerOptions: {
      isCustomElement: tag => tag.startsWith('Ion-')
    },
    devtools: false
  }), sitemap()],
  vite: {
    plugins: [wasm(), topLevelAwait()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  },
  adapter: vercel()
});