import test from "node:test";
import { strictEqual, match } from "node:assert";
import { chromium } from 'playwright';
import { isolate } from "./index.js";

test("isolate() returns a string with correct values", () => {
  const result = isolate(
    "my-wrapped-component",
    "finn",
    `<div>hello world</div>`,
    {
      styles: "div { background-color: red; }",
    }
  );

  strictEqual(typeof result, "string");
  match(result, /<my-wrapped-component>/);
  match(result, /<\/my-wrapped-component>/);
  match(result, /<template shadowrootmode="open">/);
  match(
    result,
    /<link rel="stylesheet" href="https:\/\/assets.finn.no\/pkg\/@warp-ds\/css\/v1\/resets.css">/
  );
  match(
    result,
    /<link rel="stylesheet" href="https:\/\/assets.finn.no\/pkg\/@warp-ds\/tokens\/v1\/finn-no.css">/
  );
  match(result, /<style>div { background-color: red; }<\/style>/);
  match(result, /<div>hello world<\/div>/);
});

test("isolate() returns a string with correct brand: tori", () => {
  const result = isolate("my-wrapped-component", "tori", `<div></div>`);
  match(
    result,
    /<link rel="stylesheet" href="https:\/\/assets.finn.no\/pkg\/@warp-ds\/tokens\/v1\/tori-fi.css">/
  );
});

test("isolate() returns a string with correct brand: blocket", () => {
  const result = isolate("my-wrapped-component", "blocket", `<div></div>`);
  match(
    result,
    /<link rel="stylesheet" href="https:\/\/assets.finn.no\/pkg\/@warp-ds\/tokens\/v1\/blocket-se.css">/
  );
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
            <head><link rel="stylesheet" href="https://assets.finn.no/pkg/@warp-ds/tokens/v1/finn-no.css"></head>
            <body style="margin:0;">${isolate(name, "finn", markup, options)}</body>
        </html>`
    );
    await page.screenshot({
        path: `./screenshots/chromium/finn.png`,
        omitBackground: true,
    });
    await page.setContent(
        `<html>
            <head><link rel="stylesheet" href="https://assets.finn.no/pkg/@warp-ds/tokens/v1/tori-fi.css"></head>
            <body style="margin:0;">${isolate(name, "tori", markup, options)}</body>
        </html>`
    );
    await page.screenshot({
        path: `./screenshots/chromium/tori.png`,
        omitBackground: true,
    });
    await page.setContent(
        `<html>
            <head><link rel="stylesheet" href="https://assets.finn.no/pkg/@warp-ds/tokens/v1/blocket-se.css"></head>
            <body style="margin:0;">${isolate(name, "blocket", markup, options)}</body>
        </html>`
    );
    await page.screenshot({
        path: `./screenshots/chromium/blocket.png`,
        omitBackground: true,
    });
});
