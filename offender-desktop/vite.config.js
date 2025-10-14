import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@tauri-apps/api": "/node_modules/@tauri-apps/api"
    }
  },
  optimizeDeps: {
    exclude: ["@tauri-apps/api"]
  }
});
