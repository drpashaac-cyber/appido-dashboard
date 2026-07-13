import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// APPIDO dashboard — modular SPA build.
export default defineConfig({
  base: "/os",
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
});