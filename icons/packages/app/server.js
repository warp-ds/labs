import fastifyStatic from '@fastify/static';
import Fastify from 'fastify';
import * as url from 'node:url';
import path from 'node:path';

const __dir = url.fileURLToPath(new URL('.', import.meta.url));

const app = Fastify({
  logger: true,
});

app.get('/app/:brand', async (request, reply) => {
    const html = `
      <html>
        <head>
          <title>${request.params.brand.toUpperCase()}</title>
          <link rel="stylesheet" href="/public/tokens.${request.params.brand}.css">
          <link rel="stylesheet" href="/public/base.css">
        </head>
        <body>
          <section>
            <h1>${request.params.brand.toUpperCase()}</h1>
            <div class="icon"></div>
          </section>
        </body>
      </html>
    `;
    reply.type('text/html');
    reply.code(200);
    reply.send(html);
});

app.register(fastifyStatic, {
  root: path.join(__dir, 'public'),
  prefix: '/public/', 
});

app.listen({ port: 5100 }, (err, address) => {
  if (err) throw err;
});