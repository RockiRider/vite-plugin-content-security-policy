import { test, expect } from "@playwright/test";

const TITLE = "Vite + React";

test("Index HTML Loaded", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(TITLE);
});

test("Loaded main JS script", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(`text=${TITLE}`)).toBeVisible();
});

test("Loaded CSS Styles", async ({ page }) => {
  await page.goto("/");

  const element = page.getByRole("heading", { name: TITLE });
  await expect(element).toBeVisible();

  const color = await element.evaluate(
    (el) => window.getComputedStyle(el).color
  );

  expect(color).toBe("rgb(33, 53, 71)");
});

test("JQuery is blocked by CSP", async ({ page }) => {
  let cspViolationDetected = false;
  const expectedErrorMessage =
    "Refused to load the script 'https://code.jquery.com/jquery-3.7.1.slim.js' because it violates the following Content Security Policy directive:";

  // Listen for console events and check if the expected CSP violation error occurs
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      message.text().includes(expectedErrorMessage)
    ) {
      cspViolationDetected = true;
    }
  });

  await page.goto("/");

  // Assert that the CSP violation was detected
  expect(cspViolationDetected).toBe(true);
});

test("Inline script is blocked by CSP", async ({ page }) => {
  let cspViolationDetected = false;
  let inlineScriptExecuted = false;
  const expectedErrorMessage =
    "Refused to execute inline script because it violates the following Content Security Policy directive:";
  const inlineScriptLogMessage = "Inline script executed";

  // Listen for console events and check if the expected CSP violation error occurs
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      message.text().includes(expectedErrorMessage)
    ) {
      cspViolationDetected = true;
    }
    if (
      message.type() === "log" &&
      message.text().includes(inlineScriptLogMessage)
    ) {
      inlineScriptExecuted = true;
    }
  });

  await page.goto("/");

  // Assert that the CSP violation was detected
  expect(cspViolationDetected).toBe(true);
  // Assert that the inline script log message was not detected
  expect(inlineScriptExecuted).toBe(false);
});
