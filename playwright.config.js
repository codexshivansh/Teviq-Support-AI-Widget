const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://127.0.0.1:4174",
    browserName: "chromium",
    trace: "retain-on-failure"
  },
  webServer: {
    command: "node scripts/test-server.js",
    url: "http://127.0.0.1:4174/health",
    reuseExistingServer: !process.env.CI,
    timeout: 20_000
  }
});
