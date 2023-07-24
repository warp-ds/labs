// This is import mapped to "http://localhost:3000/core/js/element.js"; for the client side when built
import WarpElement from "../../core/src/core.js";
import { html, css } from "lit";
import { play, pause, replay } from "./icons.js";

export default class Timer extends WarpElement {
  static properties = {
    duration: {},
    end: { state: true },
    remaining: { state: true },
  };
  static styles = [
    WarpElement.styles,
    css`
      :host {
        display: inline-block;
        min-width: 4em;
        text-align: center;
        padding: 0.2em;
        margin: 0.2em 0.1em;
      }
      footer {
        user-select: none;
        font-size: 0.6em;
      }
    `
  ];

  constructor() {
    super();
    this.duration = 60;
    this.end = null;
    this.remaining = this.duration * 1000;
  }

  render() {
    const { remaining, running } = this;
    const min = Math.floor(remaining / 60000);
    const sec = pad(min, Math.floor((remaining / 1000) % 60));
    const hun = pad(true, Math.floor((remaining % 1000) / 10));

    return html`
      ${min ? `${min}:${sec}` : `${sec}.${hun}`}
      <footer>
        ${remaining === 0
          ? ""
          : running
          ? html`<span @click=${this.pause}>${pause}</span>`
          : html`<span @click=${this.start}>${play}</span>`}
        <span @click=${this.reset}>${replay}</span>
      </footer>
    `;
  }

  start() {
    this.end = Date.now() + this.remaining;
    this.tick();
  }

  pause() {
    this.end = null;
  }

  reset() {
    const running = this.running;
    this.remaining = this.duration * 1000;
    this.end = running ? Date.now() + this.remaining : null;
  }

  tick() {
    if (this.running) {
      this.remaining = Math.max(0, this.end - Date.now());
      requestAnimationFrame(() => this.tick());
    }
  }

  get running() {
    return this.end && this.remaining;
  }

  updated() {
    if (!this.hydrated) {
        this.reset();
        this.hydrated = true;
    }
  }
}
customElements.define("w-timer", Timer);

function pad(pad, val) {
  return pad ? String(val).padStart(2, "0") : val;
}
