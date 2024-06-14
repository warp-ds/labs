import { CSSResult, unsafeCSS } from "lit";
import {
  getGlobalStyles,
  getGlobalStylesSync,
  isServer,
} from "./utils.js";
import "construct-style-sheets-polyfill";

/**
 * Styles object compatible with LitElement.
 * On the server side, this will a CSSResult object while client side
 * it will be a CSSStyleSheet object.
 * @see https://lit.dev/docs/components/styles/#cssresult
 *
 * @type {(import("lit").CSSResultGroup | import("lit").CSSResult | import("lit").CSSResultOrNative | import("lit").CSSResultArray)}
 */
let styles;

if (isServer()) {
  const sheets = await getGlobalStyles();
  styles = unsafeCSS(sheets.css);
} else {
  styles = new CSSStyleSheet();
  try {
    const UA = window.navigator.userAgent;
    // @ts-ignore
    const isWebkit =
      /WebKit/.test(UA) &&
      !/Chrome/.test(UA) &&
      !/Edg/.test(UA) &&
      // @ts-expect-error
      !window.MSStream;
    if (isWebkit) {
      // We do this because Safari does not always throw when this happens.
      // As is mentioned in this bug https://bugs.webkit.org/show_bug.cgi?id=242740, which leads to
      // Safari in certain cases stopping JS execution.
      throw new Error("DoesNotSupportTopLevelAwait");
    }
    // Block on fetching styles. This will throw in older browsers that don't support top level await.
    // They will fall back to a sync XMLHttpRequest.
    const sheets = await getGlobalStyles();
    styles.replaceSync(sheets.css);
  } catch (err) {
    // we do a synchronous call for browsers which don't suppoert top-level await
    const sheets = getGlobalStylesSync();
    styles.replaceSync(sheets.css);
  }
}

export { styles };
