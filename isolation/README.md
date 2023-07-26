# @warp/isolate

A package to isolate sections of a page with SSR shadow DOM (via [DSD](https://developer.chrome.com/en/articles/declarative-shadow-dom/)) and Warp support. Includes ponyfill for browsers that don't support DSD natively.

## Install

```
npm install @warp/isolate
```

## Basic Usage

```js
import { isolate } from "@warp/isolate";

const name = "my-isolated-content";
const brand = "finn"; // or "tori" or "blocket"
const markup = "<div>here is some markup to isolate</div>"; // can even be React SSR'd string
const options = {
  styles: "div { background-color: red; }", // purged Warp styles go here,
  mode: "open", // or "closed". Defaults to "open" and unless you have good reason, leave it that way.
};

const result = isolate(name, brand, markup, options);
// respond with "result" from your HTTP server.
```

## Warp usage

### Setup

First, perform setup as per [these instructions](https://warp-ds.github.io/tech-docs/getting-started/developers/)

### Build

Build dist/styles.css by running build. In this example, this is done using the Uno CLI like so...

```
npx unocss ./server.js -c uno.config.js -o dist/styles.css
```

...but you could also use Vite.

server.js will be scanned for classes and a CSS file will be compiled and placed into dist/styles.css

### Inline CSS into shadow DOM

In your server, read in dist/styles and inline it into the isolated shadow dom wrapper like so:


```js
import { isolate } from "@warp/isolate";

const __dirname = new URL(".", import.meta.url).pathname;
const styles = await fs.readFile(join(__dirname, "dist/styles.css"), "utf-8");

const name = "my-warp-app";
const brand = "finn"; // or "tori" or "blocket"
const markup = `<div class="p-4">Hello World</div>`;
const options = { styles };
const result = isolate(name, brand, markup, options);

// respond with "result" from your HTTP server.
```

See the examples/warp folder for a more complete working setup.

## React SSR with hydration

### In the server

```js
import ReactDOMServer from "react-dom/server";
import { isolate } from "@warp/isolate";
import App from "./app.jsx";

const name = "my-ssr-react-app";
const brand = "finn"; // or "tori" or "blocket"
const markup = `<div id="root">${ReactDOMServer.renderToString(<App />)}</div>`;
const result = isolate(name, brand, `<div id="root">${app}</div>`);

// respond with "result" from your HTTP server.
```

### In the client

```js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.hydrate(
  <App />,
  document.querySelector("my-ssr-react-app").shadowRoot.querySelector("#root")
);
```
