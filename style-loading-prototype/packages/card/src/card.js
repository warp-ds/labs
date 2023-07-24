// This is import mapped to "http://localhost:3000/core/js/element.js"; for the client side when built
import WarpElement from "../../core/src/core.js";
import { html, css } from "lit";

export default class WarpCard extends WarpElement {
    static styles = [
        WarpElement.styles,
        css`
            header, footer, section {
                padding: 8px;
            }
            header {
                background-color: var(--w-header-background-color, #999);
            }
            footer {
                background-color: #999;
            }
        `,
    ];

    static properties = {
        _header: {
          state: true,
          type: String,
        },
        _footer: {
            state: true,
            type: String,
        },
    };

    constructor() {
        super();
        this._header = 'Header - Shadow DOM';
        this._footer = 'Footer';
    }

    render() {
        return html`
            <div class="box">
                <header part="header">${this._header}</header>
                <section><slot></slot></section>
                <footer part="footer">${this._footer}</footer>
            </div>
        `;
    }
}

if (!customElements.get('w-card')) {
    customElements.define('w-card', WarpCard);
}