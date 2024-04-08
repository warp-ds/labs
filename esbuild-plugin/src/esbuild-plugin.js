import { parse } from "path";
import { readFile } from "fs/promises";
import * as lightning from "lightningcss";
import { createGenerator } from "@unocss/core";
import { classes } from "@warp-ds/css/component-classes/classes";
import { presetWarp } from "@warp-ds/uno";


/**
 * This ES Build plugin ensures that the Web Component in this project
 * gets injected the CSS from the Design system - WARP.
 */
const uno = createGenerator({
  presets: [
    presetWarp({
      externalClasses: classes,
      skipResets: true,
    }),
  ],
});

/**
 * Utility function which returns a minified CSS for injection into Web Components.
 *
 * This function uses UnoCSS and Lightning CSS to perform this task.
 * UnoCSS scans the input string and picks out _class names_ used, which is then
 * passed to Lightning CSS for minification.
 * @param {string} content - string to scan for CSS class names
 */
async function buildCSS(content) {
	const { css } = await uno.generate(content);
  // @ts-expect-error Filename is not required
	const { code: minified } = lightning.transform({
		code: Buffer.from(css),
		minify: true,
		targets: {
			// eslint-disable-next-line no-bitwise
			safari: 13 << 16,
		},
	});
	return minified;
}

/**
 * Function reads a file on the passed in path in order to decide if we should
 * add any CSS to this file. It looks for `@warp-css` to be somewhere in the file.
 *
 * If found the function replaces "@warp-css" with minified CSS.
 *
 * @param {import("esbuild").OnLoadArgs} args
 * @return {Promise<import("esbuild").OnLoadResult>}
 */
async function processFiles(args) {
	const { ext } = parse(args.path);
	const input = await readFile(args.path, "utf8");

	// Check if we should inject WARP CSS
	if (!input.includes("@warp-css")) return;
	// Get UnoCSS to pick out the class names used
	const css = await buildCSS(input);
	// Inject the used CSS into the Web Component
	const contents = `${input.replace("@warp-css", css.toString())}`;
	// eslint-disable-next-line consistent-return
	return {
		contents,
		loader: /** @type {import('esbuild').Loader} */ (ext.replace(".", "")),
	};
}
export default () => ({
	name: "esbuild-warp-css",
  /**
   * @param {import('esbuild').PluginBuild} build
   */
	setup(build) {
		build.onLoad(
			{
				// This is where you tell ES Build which components to scan for CSS class names.
				filter: /\/.*\.(ts|js)$/,
			},
			processFiles,
		);
	},
});
