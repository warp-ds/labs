import path from "node:path";
import { readFile } from "node:fs/promises";
import * as lightning from "lightningcss";
import { createGenerator } from "@unocss/core";
import { presetWarp } from "@warp-ds/uno";
// @ts-expect-error
import { nanoid } from 'nanoid';
import { Tree } from './tree.js';
// @ts-expect-error
import { classes } from "@warp-ds/css/component-classes/classes";
import browserslist from "browserslist";

const targets = lightning.browserslistToTargets(browserslist("supports es6-module and > 0.25% in NO and not dead"))

const uno = createGenerator({
  presets: [
    presetWarp({
      externalClasses: classes,
      skipResets: true,
    }),
  ],
});

/**
 *
 * @param {string} content
 * @param {object} options
 * @param {boolean} [options.minify]
 * @returns lightningcss minified css
 */
const buildCSS = async (content, options = {
  minify: false
}) => {
  const { css } = await uno.generate(content);
  let output = css;

  const { code } = lightning.transform({
    filename: "",
    code: Buffer.from(css),
    minify: options.minify,
    targets: {
      // @ts-expect-error
      targets,
    },
  });
  output = code.toString();

  return output.replace(/\\/g, "\\\\");
};


/**
 * @param {object} options
 * @param {RegExp} [options.filter] 
 * @param {string} [options.placeholder] 
 * @param {boolean} [options.minify] 
 * @returns object
 */
export const plugin = ({ filter = /.*?/, placeholder = '@warp-css', minify = true } = {}) => {
  /** @type {import('esbuild').Plugin}*/
  return {
    name: "warp-esbuild-plugin",
    setup(build) {
      // @ts-ignore
      
      // const options = build.initialOptions;
      const tree = new Tree();

      // On resolve build up a import tree hierarchy of which files 
      // import which files in the module structure
      build.onResolve({ filter }, (args) => {
        const { dir } = path.parse(args.importer)
        const file = path.resolve(dir, args.path);

        if (args.kind === 'entry-point') {
          tree.set(file);
          return {};
        }

        tree.set(file, args.importer);

        return {};
      });

      // On load detect all files which has a @warp-css tag and
      // rewrite the tag to a unique tag. Store the unique tag 
      // on the node in the import tree hierarchy.
      // Do also store the content of each file on the node for
      // the file in the import tree hierarchy
      build.onLoad({ filter }, async (args) => {
        const { ext } = path.parse(args.path);
        let contents = await readFile(args.path, "utf8");

        if (contents.includes(placeholder)) {
          const tag = `@css-placeholder-${nanoid(6)}`;
          contents = contents.replace(placeholder, tag);  
          tree.tag(args.path, tag);
        } 

        tree.setContent(args.path, contents);

        return {
          contents,
          // @ts-ignore
          loader: ext.replace(".", ""),
        };
      });
      
      // On build, get all unique tags and for each unique tag
      // get the content of the node holding the tag plus the
      // content of all its sub nodes in the import tree hierarchy.
      // Then run through each tag, build a css based on the code
      // for the node holding the tag and all its sub modules.
      // Then replace the unique tag in the source with the built
      // css for the matching unique tag. 
      build.onEnd(async (result) => {
        const tags = await tree.getContentFromTags();

        for await (const tag of tags) {
          tag.css = await buildCSS(tag.code, { minify });
        }

        result.outputFiles.forEach((file) => {
          let source = new TextDecoder("utf-8").decode(file.contents);
          
          tags.forEach((tag) => {
            source = source.replaceAll(tag.tag, tag.css);
          });
          
          file.contents = Buffer.from(source);
        });
      });

      build.onDispose(() => {
        tree.clear();
      });
    },
  }
}
