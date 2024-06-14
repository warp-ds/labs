import { build } from "esbuild";
import * as eik from "@eik/esbuild-plugin";

eik.load().then(() => {
  Promise.all([
    build({
      entryPoints: ["./src/element.js"],
      bundle: true,
      format: "esm",
      outfile: "./dist/element.js",
      sourcemap: true,
      minify: true,
      supported: {
        "top-level-await": true, // We're handling the fallback
      },
      target: ["es2017"],
      legalComments: `none`,
      plugins: [eik.plugin()],
    }),
    build({
      entryPoints: ["./src/global.js"],
      bundle: true,
      format: "esm",
      outfile: "./dist/global.js",
      sourcemap: true,
      minify: true,
      supported: {
        "top-level-await": true, // We're handling the fallback
      },
      target: ["es2017"],
      legalComments: `none`,
      plugins: [eik.plugin()],
    }),
  ]);
});
