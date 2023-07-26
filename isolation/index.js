import assert from "node:assert";
import { wrap } from "@hide-in-shadows/html";

const brands = {
  blocket: "/blocket-se.css",
  finn: "/finn-no.css",
  tori: "/tori-fi.css",
};

/**
 * Isolates a piece of HTML from the rest of the page using shadow DOM.
 * Warp reset and brand CSS is automatically added to the shadow root.
 * Additional CSS styles can be added to the shadow root by passing a string to options.styles.
 *
 * @param {string} name Valid string to name the isolation wrapper element. Use only lowercase letters and dashes.
 * @param {"finn" | "tori" | "blocket"} brand Determines which brand token CSS file to include
 * @param {string} markup HTML markup to be isolated. Only HTML that can is valid inside the body element is allowed.
 * @param {{ styles?: string, mode?: "open" | "closed"}} [options] Additional options. styles is a string of CSS styles to be added to the shadow root. mode determines if the shadow root is open or closed.
 * @returns {string} HTML markup with shadow root wrapper ready for insertion into a page.
 */
export function isolate(name, brand, markup, options) {
  assert(typeof name === "string", "name must be a string");
  assert(/[a-z][a-z-]*/.test(name), "name must match expected pattern");
  assert(
    Object.keys(brands).includes(brand),
    `brand must be one of ${Object.keys(brands).join(", ")}`
  );
  assert(typeof markup === "string", "markup must be a string");

  let styles = `<link rel="stylesheet" href="https://assets.finn.no/pkg/@warp-ds/css/v1/resets.css">
    <link rel="stylesheet" href="https://assets.finn.no/pkg/@warp-ds/tokens/v1${brands[brand]}">
  `;

  if (options?.styles) {
    styles += `  <style>${options.styles}</style>`;
  }

  return wrap(name, `${styles}\n    ${markup}`, {
    mode: options?.mode || "open",
  });
}
