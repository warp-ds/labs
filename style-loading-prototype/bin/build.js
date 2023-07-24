import esbuild from "esbuild";

const cwd = process.cwd();

const entryPoints = [`${cwd}/src/content.js`, `${cwd}/src/fallback.ts`];
const plugins = [];

await esbuild.build({
    resolveExtensions: ['.js', '.ts'],
    target: 'esnext',
    charset: 'utf8',
    plugins,
    entryPoints,
    bundle: false,
    format: "esm",
    outdir: `${cwd}/dist/`,
    minify: false,
});
