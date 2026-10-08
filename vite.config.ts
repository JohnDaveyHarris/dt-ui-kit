import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react(), dts({ include: ["src"] })],
  css: {
    modules: { generateScopedName: "ui-[name]__[local]--[hash:base64:5]" },
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
    },
    rollupOptions: {
      // react уезжает в peerDependencies, в бандл не попадает
      external: [/^react($|\/)/, /^react-dom($|\/)/],
    },
  },
});
