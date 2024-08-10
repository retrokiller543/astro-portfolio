import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'astro/config';
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import icon from "astro-icon";

import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
  integrations: [wasm(), icon(), vue({
    appEntrypoint: '/src/_app',
    compilerOptions: {
      isProduction: false,
      isCustomElement: (tag) => tag.startsWith('Ion-'),
    },
    devtools: true,
  })],
  vite: {
    plugins: [wasm(), topLevelAwait()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
});