import assertSnapshot from "snapshot-assertion";
import esbuild from "esbuild";
import test from "node:test";
import path from "node:path";
import url from "node:url";

import { plugin } from "../src/plugin.js";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const complex = `${__dirname}/fixtures/complex/component.js`;
const simple = `${__dirname}/fixtures/simple/simple.js`;

const bufferToString = (buff) => {
  const str = [];
  for (let out of buff) {
    str.push(new TextDecoder("utf-8").decode(out.contents));
  }
  return str.join("");
};

test("plugin() - Simple module structure", async () => {
  const result = await esbuild.build({
    entryPoints: [simple],
    bundle: true,
    format: "esm",
    minify: false,
    sourcemap: false,
    plugins: [plugin()],
    write: false,
  });

  await assertSnapshot(
    bufferToString(result.outputFiles),
    "snapshots/warp-1.snapshot"
  );
});

test("plugin() - Complex module structure", async () => {
  const result = await esbuild.build({
    entryPoints: [complex],
    bundle: true,
    format: "esm",
    minify: false,
    sourcemap: false,
    external: ["lit"],
    plugins: [plugin()],
    write: false,
  });

  await assertSnapshot(
    bufferToString(result.outputFiles),
    "snapshots/warp-2.snapshot"
  );
});
