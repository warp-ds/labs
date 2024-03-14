import WarpElement from "@warp-ds/elements-core";
import { css, html } from "lit";

export class HelloWorld extends WarpElement {
	static styles = [
		css`
			@warp-css;
		`,
	];

  render() {
		return html`<p>Hello, World!</p>`;
	}
}

if (!customElements.get("hello-world")) {
	customElements.define("hello-world", HelloWorld);
}
