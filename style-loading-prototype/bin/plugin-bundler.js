import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import esbuild from "esbuild";
import etag from '@fastify/etag';
import fp from 'fastify-plugin';

import * as importMap from "esbuild-plugin-import-map";

const require = createRequire(import.meta.url);

importMap.load('http://localhost:3000', {
    imports: {
        '@warp-ds/elements-core': '/_/dynamic/modules/@warp-ds/elements-core/element.js',
        'lit': '/_/dynamic/modules/lit'
    }
});

const build = async ({ entryPoints = [] } = {}) => {
    const result = await esbuild.build({
        resolveExtensions: ['.js', '.ts'],
        legalComments: 'none',
        entryPoints,
        charset: 'utf8',
        plugins: [],
        target: 'esnext',
        bundle: true,
        //sourcemap: true,
        format: "esm",
        plugins: [importMap.plugin()],
        outdir: `${tmpdir()}/wc-demo`,
        minify: true,
        write: false,
    });
    return result.outputFiles[0].text;
}

export default fp((fastify, {
    cwd = process.cwd(),
} = {}, next) => {

    fastify.register(etag, {
        algorithm: 'fnv1a'
    });

    const elementCache = new Map();
    const moduleCache = new Map();

    fastify.get('/_/dynamic/elements/:component.js', async (request, reply) => {        
        const component = request.params['component'];

        if (!elementCache.has(component)) {
            const body = await build({
                entryPoints: [`${cwd}/packages/${component}/src/${component}`],
            });

            elementCache.set(component, body);
        }

        reply.type("application/javascript");
        reply.send(elementCache.get(component));
    });

    fastify.get('/_/dynamic/modules/*', async (request, reply) => {
        const depname = request.params['*'];
        
        if (!moduleCache.has(depname)) {
            const filepath = require.resolve(depname, { paths: [cwd] });

            const body = await build({
                entryPoints: [filepath],
            });

            moduleCache.set(depname, body);
        }

        reply.type("application/javascript");
        reply.send(moduleCache.get(depname));
    });

    next()
}, {
  fastify: '4',
  name: 'plugin-bundler'
})