import { LitElement, css, unsafeCSS, isServer } from "lit";

let brandCss = '';
let baseCss = '';

if (isServer) {
    brandCss = unsafeCSS`@import url("http://localhost:3000/_/static/styles/brand.css");`;
    baseCss = unsafeCSS`@import url("http://localhost:3000/_/static/styles/base.css");`;
} else {
    brandCss = new CSSStyleSheet();
    baseCss = new CSSStyleSheet();

    const response = await Promise.all([
        fetch('http://localhost:3000/_/static/styles/brand.css'),
        fetch('http://localhost:3000/_/static/styles/base.css'),
    ]);

    brandCss.replaceSync(await response[0].text());
    baseCss.replaceSync(await response[1].text());
}

// stylesheet.replaceSync(brand);

// Later on we can do (works in Chrome but not FireFox):
// import styles from 'http://localhost:3000/styles/base.css' assert {type: 'css'};

// console.log(stylesheet);

export default class WarpElement extends LitElement {
    static styles = [
        brandCss,
        baseCss,
        css`
            .box {
                border: 2px solid var(--w-box-border-color, #000);
                margin-bottom: 8px;
                background-color: #efefef;
            }
        `];

    static properties = {
        _lang: {
            state: true,
            type: String,
        }
    };

    constructor() {
        super();
    }

    get initialState() {
      return {
        warp: true
      };
    }
}
