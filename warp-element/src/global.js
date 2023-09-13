import { CSSResult, unsafeCSS } from "lit";
import { getBrand, getGlobalStyles, isServer } from "./utils.js";
import "construct-style-sheets-polyfill";

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
 * Styles object compatible with LitElement.
 * On the server side, this will a CSSResult object while client side
 * it will be a CSSStyleSheet object.
 * @see https://lit.dev/docs/components/styles/#cssresult
 *
 * @type {CSSStyleSheet | CSSResult}
 */
let styles;

if (isServer()) {
  const sheets = await getGlobalStyles(brand);
  styles = unsafeCSS(sheets.css);
} else {
  styles = new CSSStyleSheet();
  try {
    // block on fetching styles. This will throw in older browsers that don't support top level await
    const sheets = await getGlobalStyles(brand);
    styles.replaceSync(sheets.css);
  } catch (err) {
    // fallback for older browsers that don't support top level await
    // generates some FOUC but much better than an error.
    getGlobalStyles(brand).then((sheets) => {
      // I don't understand why TS can't infer this. Theres no possible way I can see that at this point
      // styles is not a CSSStyleSheet object. Maybe it's because its async?
      /** @type {CSSStyleSheet} */ (styles).replaceSync(sheets.css);
    });
  }
}

export { styles };
