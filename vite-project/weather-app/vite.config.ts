// import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   port: 3000,
  // },
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./setup.ts"],
  },
});
