// This is import mapped to "http://localhost:3000/core/js/element.js"; for the client side when built
import WarpElement from "../../core/src/core.js";

import { html } from "lit";

export default class WarpButton extends WarpElement {
    static styles = [
        WarpElement.styles,
    ];

    constructor() {
      super();
    }

    render() {
        return html`<button>Click me!</button>`;
    }
}

if (!customElements.get('w-button')) {
    customElements.define('w-button', WarpButton);
}