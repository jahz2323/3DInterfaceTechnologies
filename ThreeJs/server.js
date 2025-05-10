import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { WebSocketServer } from 'ws'; // Correct import

const hostname = '0.0.0.0';
const port = 3000;

// Base directory of the project
const root = process.cwd();

const server = http.createServer(async (req, res) => {
    // Default to "index.html" if the root is requested
    const filePath = req.url === '/' ? '/index.html' : req.url;
    const resolvedPath = path.join(root, filePath);

    // Determine the MIME type based on file extension
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.ico': 'image/x-icon',
        '.svg': 'image/svg+xml',
    };
    const ext = path.extname(resolvedPath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    try {
        // Read the file asynchronously
        const data = await fs.readFile(resolvedPath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    } catch (err) {
        console.error(`File not found: ${resolvedPath}`);
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404: Not Found');
    }
});

// WebSocket Server Setup (attached to the HTTP server)
const wss = new WebSocketServer({ server: server });

wss.on('connection', ws => {
    console.log('Client connected');

    ws.on('message', message => {
        console.log('Received:', message.toString());
        ws.send(`Server received: ${message}`);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.on('error', error => {
        console.error('WebSocket error:', error);
    });

    ws.send('Welcome to the WebSocket server!');
});

// Start the HTTP server (which will also handle WebSocket connections)
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
    console.log(`WebSocket server also running on the same port`);
});


