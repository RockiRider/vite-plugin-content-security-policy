import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

const APPS = [
  {
    url: "http://localhost:3000",
    command: `pnpm r:dev`,
    testDir: "./apps/react/tests",
    name: "React - Dev",
  },
  {
    url: "http://localhost:4000",
    command: `pnpm r:preview`,
    testDir: "./apps/react/tests",
    name: "React - Build",
  },
  {
    url: "http://localhost:3001",
    command: `pnpm mui:dev`,
    testDir: "./apps/mui/tests",
    name: "Mui - Dev",
  },
  {
    url: "http://localhost:4001",
    command: `pnpm mui:preview`,
    testDir: "./apps/mui/tests",
    name: "Mui - Build",
  },
  {
    url: "http://localhost:3002",
    command: `pnpm em:dev`,
    testDir: "./apps/emotion/tests",
    name: "Emotion - Dev",
  },
  {
    url: "http://localhost:4002",
    command: `pnpm em:preview`,
    testDir: "./apps/emotion/tests",
    name: "Emotion - Build",
  },
  {
    url: "http://localhost:3003",
    command: `pnpm tailwind:dev`,
    testDir: "./apps/tailwind/tests",
    name: "Tailwind - Dev",
  },
  {
    url: "http://localhost:4003",
    command: `pnpm tailwind:preview`,
    testDir: "./apps/tailwind/tests",
    name: "Tailwind - Build",
  },
  {
    url: "http://localhost:3004",
    command: `pnpm sass:dev`,
    testDir: "./apps/sass/tests",
    name: "Sass - Dev",
  },
  {
    url: "http://localhost:4004",
    command: `pnpm sass:preview`,
    testDir: "./apps/sass/tests",
    name: "Sass - Build",
  },
  {
    url: "http://localhost:3005",
    command: `pnpm less:dev`,
    testDir: "./apps/less/tests",
    name: "Less - Dev",
  },
  {
    url: "http://localhost:4005",
    command: `pnpm less:preview`,
    testDir: "./apps/less/tests",
    name: "Less - Build",
  },
  {
    url: "http://localhost:3006",
    command: `pnpm stylus:dev`,
    testDir: "./apps/stylus/tests",
    name: "Stylus - Dev",
  },
  {
    url: "http://localhost:4006",
    command: `pnpm stylus:preview`,
    testDir: "./apps/stylus/tests",
    name: "Stylus - Build",
  },
  {
    url: "http://localhost:3007",
    command: `pnpm vue:dev`,
    testDir: "./apps/vue/tests",
    name: "Vue - Dev",
  },
  {
    url: "http://localhost:4007",
    command: `pnpm vue:preview`,
    testDir: "./apps/vue/tests",
    name: "Vue - Build",
  },
];

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  name: "React Tests",
  outputDir: "test-results",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: APPS.map((app) => {
    return {
      name: app.name,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: app.url,
      },
      testDir: app.testDir,
    };
  }),

  /* Run your local dev server before starting the tests */
  webServer: APPS.map((app) => {
    return {
      command: app.command,
      url: app.url,
      timeout: 60 * 1000, // 60 seconds
      reuseExistingServer: !process.env.CI,
    };
  }),
});
