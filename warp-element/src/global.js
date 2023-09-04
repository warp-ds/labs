import { getBrand, getGlobalStyles } from "./utils.js";

/**
 * Returns a Brand object with top level- and
 * second level domain string.
 *
 *  @see https://developer.mozilla.org/en-US/docs/Glossary/Second-level_Domain
 *  @see https://developer.mozilla.org/en-US/docs/Glossary/TLD
 * @typedef {Object} Brand
 * @property {string} sld - second level domain
 * @property {string} tld - top level domain
 */

const brand = getBrand();
/**
 * @typedef {CSSStyleSheet[] | import("@lit/reactive-element").CSSResult[]} Styles
 */
export const styles = await getGlobalStyles(brand);
