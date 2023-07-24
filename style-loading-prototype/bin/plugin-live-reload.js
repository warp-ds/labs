import { WebSocketServer } from 'ws';
import chokidar from "chokidar";
import etag from '@fastify/etag';
import fp from 'fastify-plugin';

const CLIENT = `
    const livereload = () => {
        const ws = new WebSocket('ws://' + window.location.host + '/_/live/reload');
        ws.addEventListener("message", (event) => {
          if (event.data === 'update') {
            window.location.reload(true);
          }
        });
        ws.addEventListener("close", () => {
            setTimeout(() => {
                livereload();
            }, 1000);
        });
        ws.addEventListener("error", () => {
            ws.close();
        });
    }
    livereload();
`

export default fp((fastify, {
    watch = [`${process.cwd()}/packages`],
    cwd = process.cwd(),
} = {}, next) => {

    fastify.register(etag, {
        algorithm: 'fnv1a'
    });

    const wss = new WebSocketServer({ 
        server: fastify.server,
        path: '/_/live/reload',
    });

    wss.on('connection', (ws, req) => {
        fastify.log.debug('live reload - server got connection from browser');
    
        ws.isAlive = true;
    
        ws.on('pong', () => {
            ws.isAlive = true;
        });
    
        ws.on('error', (error) => {
            fastify.log.debug('live reload - connection to browser errored');
            fastify.log.error(error);
        });
    });
    
    wss.on('error', (error) => {
        fastify.log.debug('live reload - server errored');
        fastify.log.error(error);
    });
    
    const pingpong = setInterval(() => {
        wss.clients.forEach((client) => {
            if (client.isAlive === false) return client.terminate();
            client.isAlive = false;
            client.ping(() => {
                // noop
            });
        });
    }, 30000);

    wss.on('close', () => {
        fastify.log.debug('live reload - server closed');
        clearInterval(pingpong);
    });

    function onFileChange(path) {
        wss.clients.forEach((client) => {
            client.send('update', () => {
                // Something went wrong....
            });
        });
    }  

    const watcher = chokidar.watch(watch, {
        persistent: true,
        followSymlinks: false,
        cwd,
    });

    watcher.on("ready", () => {
        watcher.on("change", onFileChange);
        watcher.on("add", onFileChange);
        watcher.on("unlink", onFileChange);
    });
    
    watcher.on("error", (error) => {
        fastify.log.debug('live reload - file watching errored');
        fastify.log.error(error);
    });


    fastify.addHook('onClose', (fastify, done) => wss.close(done));

    fastify.get('/_/live/client', (request, reply) => {
        reply.type("application/javascript");
        reply.send(CLIENT);
    });

    next()
}, {
  fastify: '4',
  name: 'plugin-live-reload'
})