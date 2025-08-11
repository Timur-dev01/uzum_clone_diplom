import { profile } from "node:console";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "./",
  esbuild: {
    target: "esnext",
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        basket: resolve(__dirname, "src/pages/Basket.html"),
        category: resolve(__dirname, "src/pages/Category.html"),
        favorite: resolve(__dirname, "src/pages/Favorite.html"),
        basic: resolve(__dirname, "src/pages/main.html"),
        productInfo: resolve(__dirname, "src/pages/ProductInfo.html"),
        profile: resolve(__dirname, "src/pages/Profile.html"),
      },
    },
  },
});
