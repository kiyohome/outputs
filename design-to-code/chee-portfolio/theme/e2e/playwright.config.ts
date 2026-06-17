import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: process.env.STG_URL ?? "http://localhost:8080",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { channel: "chromium" } }],
});
