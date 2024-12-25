import { test, expect } from "@playwright/test";


type ElementColours = {
  headerColour: string;
  buttonColour: string;
}
export const genericTests = (title: string, {headerColour, buttonColour}: ElementColours) => {
  test("Index HTML Loaded", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(title);
  });

  test("Loaded main JS script", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(`text=${title}`)).toBeVisible();
  });

  test("Loaded CSS Styles", async ({ page }) => {
    await page.goto("/");

    const header = page.getByRole("heading", { name: title });
    const button = page.getByRole("button", {name: "count is"})
    await expect(header).toBeVisible();
    await expect(button).toBeVisible();

    const headerCol = await header.evaluate(
      (el) => window.getComputedStyle(el).color
    );

    const buttonCol = await button.evaluate(el => window.getComputedStyle(el).backgroundColor)

    expect(headerCol).toBe(headerColour);
    expect(buttonCol).toBe(buttonColour);
  });
}

export const viteLogoTest = () => {
  test("Vite logo is loaded", async ({ page }) => {
    await page.goto("/");
    const viteLogo = page.locator('img[alt="Vite logo"]');
    await expect(viteLogo).toBeVisible();
    const naturalWidth = await viteLogo.evaluate((img) => (img as HTMLImageElement).naturalWidth);
    expect(naturalWidth).toBeGreaterThan(1);
  });
}

export const jQueryTest = () => {

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
}

export const overrideTest = (title: string) => {

  test("Override flag is working in plugin", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(`text=${title}`)).toBeVisible();

    // Get the meta tag and read the "font-src" attribute, which should contain the value "https://fonts.gstatic.com"
    const metaElement = page.locator(
      'meta[http-equiv="Content-Security-Policy"]'
    );

    const content = await metaElement.getAttribute("content");

    expect(content).toContain("font-src https://fonts.gstatic.com");
    expect(content).not.toContain("img-src");
  });

}

export const inlineScriptBlockedTest = (title: string) => {

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
    await expect(page).toHaveTitle(title);
    await expect(page.locator("h3").textContent()).resolves.toBe("Home");

    // Assert that the CSP violation was detected
    expect(cspViolationDetected).toBe(true);
    // Assert that the inline script log message was not detected
    expect(inlineScriptExecuted).toBe(false);
  });
}