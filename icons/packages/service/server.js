import { readFile } from 'node:fs/promises';
import * as url from 'node:url';
import path from 'node:path';
import { optimize } from 'svgo';
import Fastify from 'fastify';

const __dir = url.fileURLToPath(new URL('.', import.meta.url));

const fastify = Fastify({
  logger: true,
});


fastify.get('/api/:brand/:name/:width/:height/icon.svg', async (request, reply) => {
    const tokensPath = path.join(__dir, `../icons/tokens/${request.params.brand}.css`);
    const tokensFile = await readFile(tokensPath, { encoding: 'utf8' });

    const svgPath = path.join(__dir, '../icons/lib', request.params.name, '/master.svg');
    let svgFile = await readFile(svgPath, { encoding: 'utf8' });

    svgFile = svgFile.replace('<style>', `<style>${tokensFile}`);

    const result = optimize(svgFile, {
        multipass: true,
        plugins: [
            'preset-default',
            'removeDimensions'
          ],
    });

    let out = result.data;
    out = out.replace(/viewBox="([^"]+)"/, `width="${request.params.width}" height="${request.params.height}" viewBox="0 0 100 100"`);

    reply.type('image/svg+xml');
    reply.code(200);
    reply.send(out);
});

fastify.listen({ port: 5000 }, (err, address) => {
  if (err) throw err;
  // Server is now listening on ${address}
});