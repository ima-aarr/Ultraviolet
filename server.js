import { createBareServer } from '@tomphttp/bare-server-node';
import express from 'express';
import { createServer } from 'node:http';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const bareServer = createBareServer('/bare/');
const app = express();

app.use(express.static(join(__dirname, 'public')));

const server = createServer();

server.on('request', (req, res) => {
    if (bareServer.shouldRoute(req)) {
        bareServer.routeRequest(req, res);
    } else {
        app(req, res);
    }
});

server.on('upgrade', (req, socket, head) => {
    if (bareServer.shouldRoute(req)) {
        bareServer.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

server.listen({ port: 8080 });
