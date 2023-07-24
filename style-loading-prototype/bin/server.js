import fastify from 'fastify';
import fileServer from '@fastify/static';

import { render } from '@lit-labs/ssr';
import { html } from 'lit';

import bundler from "./plugin-bundler.js";
import reload from "./plugin-live-reload.js";

import button from '../packages/button/src/button.js';
import timer from '../packages/timer/src/timer.js';
import card from '../packages/card/src/card.js';

const document = (body) => {
    return `<!doctype html>
        <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <meta http-equiv="X-UA-Compatible" content="IE=Edge">
                <link rel="preload" href="/_/static/fonts/IndieFlower-Regular.ttf" as="font" type="font/ttf" crossorigin>
                <script src="/_/dynamic/modules/@lit-labs/ssr-client/lit-element-hydrate-support.js" type="module"></script>
                <script src="/_/dynamic/elements/button.js" type="module"></script>
                <script src="/_/dynamic/elements/timer.js" type="module"></script>
                <script src="/_/dynamic/elements/card.js" type="module"></script>
                <link href="/_/static/styles/brand.css" rel="stylesheet" type="text/css">
                <link href="/_/static/styles/base.css" rel="stylesheet" type="text/css">
                <link href="/_/static/styles/document.css" rel="stylesheet" type="text/css">
                <script src="/_/live/client" type="module" defer></script>
                <!-- 
                <style>
                    w-timer:not(:defined) > template[shadowrootmode] ~ *,
                    w-button:not(:defined) > template[shadowrootmode] ~ *,
                    w-card:not(:defined) > template[shadowrootmode] ~ * {
                        display: none;
                    }
                </style>
                -->

                <script>
                    // From: https://github.com/web-platform-tests/wpt/blob/master/resources/declarative-shadow-dom-polyfill.js
                    window.dsd = (root) => {
                        if (HTMLTemplateElement.prototype.hasOwnProperty('shadowRootMode')) {
                            return;
                        }

                        const element = root ? root : document?.currentScript?.previousElementSibling;

                        element.querySelectorAll("template[shadowrootmode]").forEach(template => {
                            const mode = template.getAttribute("shadowrootmode");
                            const delegatesFocus = template.hasAttribute("shadowrootdelegatesfocus");
                            const shadowRoot = template.parentNode.attachShadow({ mode, delegatesFocus });
                            shadowRoot.appendChild(template.content);
                            template.remove();                            
                            window.dsd(shadowRoot);
                        });
                    }
                </script>
            </head>
            <body>
                ${body}
            </body>
        <html>
    `;
};

const dsd =() => {
    return html`
        <script>window.dsd();</script>
    `;
}

const box = () => {
    return `
        <div class="box">
            <header part="header">Header - Shallow DOM</header>
            <section>I live in the shallow DOM</section>
            <footer part="footer">Footer</footer>
        </div>
    `;
};

const app = fastify({ 
    disableRequestLogging: true,
    logger: true, 
});

app.register(bundler, {});
app.register(reload, {});

app.register(fileServer, {
    root: new URL('../static', import.meta.url),
    prefix: '/_/static/',
});

app.get('/favicon.ico', async (request, reply) => {
    reply.type("text/html; charset=utf-8");
    return ``;
});

app.get('/', async (request, reply) => {
    /*
    reply.header('Link', [
        '</styles/base.css>; rel=prefetch',
        '</styles/brand.css>; rel=prefetch',
        '</_/dynamic/elements/core.js>; rel=prefetch',
    ].join(','));
    */

    reply.type("text/html; charset=utf-8");

    const elements = render(html`
        <w-card>Slot content</w-card>
        ${dsd()}
        <w-card>
            <w-timer duration="60"></w-timer>
        </w-card>
        ${dsd()}
        <w-card>
            <w-button></w-button>
        </w-card>
        ${dsd()}
    `);
  
    const els = Array.from(elements).join('');
    return document(`
        ${box()}
        ${els}
        ${box()}
    `); 
});

try {
    await app.listen({ port: 3000 });
} catch (err) {
    app.log.error(err);
    process.exit(1);
}