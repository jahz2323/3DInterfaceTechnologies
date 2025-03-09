import http from 'http';
import fs from 'fs/promises';
import path from 'path';

const hostname = '127.0.0.1';
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

// Start the server
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});