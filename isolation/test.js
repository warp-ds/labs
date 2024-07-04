import test from "node:test";
import { strictEqual } from "node:assert";
import assertSnapshot from "snapshot-assertion";
import { chromium } from "playwright";
import { isolate } from "./index.js";

test("isolate() returns a string with correct values", async () => {
  const result = isolate("my-wrapped-component", `<div>hello world</div>`, {
    styles: "div { background-color: red; }",
  });

  strictEqual(typeof result, "string");
  await assertSnapshot(result, "snapshots/isolate-1.snapshot");
});

test("isolate() renders correctly in chrome", async () => {
  const name = "test-app";
  const markup = `<div>Hello World</div>`;
  const options = { styles: "div { background-color: red; }" };

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.setContent(
    `<html>
            <head>
              <link rel="stylesheet" href="https://assets.finn.no/pkg/@warp-ds/css/v2/tokens/finn-no.css">
              <link rel="stylesheet" href="https://assets.finn.no/pkg/@warp-ds/fonts/v1/finn-no.css">
            </head>
            <body style="margin:0;">${isolate(name, markup, options)}</body>
        </html>`
  );

  await page.screenshot({
    path: `./screenshots/chromium/finn.png`,
    omitBackground: false,
  });

  await browser.close();
});
