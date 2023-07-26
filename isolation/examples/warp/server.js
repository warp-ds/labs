import fs from "fs/promises";
import { join } from "path";
import fastify from "fastify";
import { isolate } from "../../index.js";

const __dirname = new URL(".", import.meta.url).pathname;
const styles = await fs.readFile(join(__dirname, "dist/styles.css"), "utf-8");

const server = fastify();
server.get("/", async (request, reply) => {
  reply.type("text/html").send(
    `<html>
        <head>
        <!-- Must include fonts in document head as well as in shadow DOM for them to work in Chrome -->
        <link rel="stylesheet" href="https://assets.finn.no/pkg/@warp-ds/tokens/v1/finn-no.css">
        </head>
        <body style="margin:0;">
            ${isolate(
              "my-wrapped-component",
              "finn",
              `<div class="p-4">Hello World</div>`,
              { styles }
            )}
        </body>
    </html>`
  );
});
server.listen({ port: 3000 });
