import { LitElement, css, unsafeCSS, isServer } from "lit";

const getBrand = (host = '') => {
    if (host.toLocaleLowerCase().includes('blocket.se')) return 'blocket';
    if (host.toLocaleLowerCase().includes('tori.fi')) return 'tori';
    if (host.toLocaleLowerCase().includes('finn.no')) return 'finn';
    if (host.toLocaleLowerCase().includes('dba.dk')) return 'dba';
    return 'brand';
}

let brandCss = '';
let baseCss = '';
let brand = '';

if (isServer) {
    brand = getBrand('localhost'); // can be picked from the host object on the server request or from a config
    brandCss = unsafeCSS(`@import url("http://localhost:3000/_/static/styles/${brand}.css");`);
    baseCss = unsafeCSS(`@import url("http://localhost:3000/_/static/styles/base.css");`);
} else {
    brandCss = new CSSStyleSheet();
    baseCss = new CSSStyleSheet();
    brand = getBrand(window?.location?.host);

    const response = await Promise.all([
        fetch(`http://localhost:3000/_/static/styles/${brand}.css`),
        fetch(`http://localhost:3000/_/static/styles/base.css`),
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
