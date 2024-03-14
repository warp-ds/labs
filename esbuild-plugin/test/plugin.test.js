import esbuild from 'esbuild';
import { test } from 'tap';
import warpCssPlugin from '../src/esbuild-plugin.js';

test('does the expected replacement of `@warp-css`', async (t) => {
  const result = await esbuild.build({
    entryPoints: ['test/fixtures/Component.js'],
    bundle: true,
    plugins: [warpCssPlugin()],
    format: "esm",
    write: false,
  });

  t.ok(result.outputFiles?.length === 1, 'Expected ESbuild not to fail');

  const output = result.outputFiles[0].text;
  t.match(output, /<p>Hello, World!<\/p>/, 'Expected the contents to include the Component fixture');

  t.notMatch(output, /@warp-css;/, 'Expected `@warp-css` to be replaced');
});
