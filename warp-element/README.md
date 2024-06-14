# @warp/elements-core

## Introduction

The `@warp-ds/elements-core` package is part of the Warp Design System Labs, a monorepo used for experimentation around solutions within the Warp Design System. The `@warp-ds/elements-core` package focuses on delivering a `WarpElement` component built with Lit, which is used to extend Web Components in [@warp-ds/elements](https://github.com/warp-ds/elements) package, ensuring better performance through style sharing and automatic theme recognition.

## Installation

To install the elements-core package, you can use npm:

```sh
npm install @warp-ds/elements-core
```

or pnpm:

```sh
pnpm add @warp-ds/elements-core
```

## Usage

In order to make Warp styles available in your Web Component, you must extend your component with `WarpElement` and reference its `styles` property in the following manner:

```js
import WarpElement from '@warp-ds/elements-core';

class MyComponent extends WarpElement {
  static styles = [WarpElement.styles];
  ...
}
```

## use with Vite

Additional (non-obvious) configuration is needed to use this module with Vite. Even if you have Vite's `build.target` set to `esnext`.

```js
export default defineConfig({
  optimizeDeps: {
    esbuildOptions: { target: 'esnext' }
  },
  //...
})
```

## Releases

This project is continuously published to [NPM](https://www.npmjs.com/package/@warp-ds/elements-core) and [Eik](https://assets.finn.no/pkg/@warp-ds/elements-core).

## Contributing

We welcome contributions to the `@warp-ds/elements-core` package! If you would like to contribute, start by reviewing the [contributing guidelines](CONTRIBUTING.md).

## License

`@warp-ds/elements-core` is available under the [Apache-2.0 software license](LICENSE).