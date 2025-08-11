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
        home: resolve(__dirname, "src/pages/home.html"),
        signin: resolve(__dirname, "src/pages/signin.html"),
        signup: resolve(__dirname, "src/pages/signup.html"),
        wallets: resolve(__dirname, "src/pages/wallets.html"),
        transaction: resolve(__dirname, "src/pages/transaction.html"),
        walletadd: resolve(__dirname, "src/pages/walletadd.html"),
        transactionadd: resolve(__dirname, "src/pages/transactionadd.html"),
      },
    },
  },
});
