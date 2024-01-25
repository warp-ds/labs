# @warp/elements-core

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
