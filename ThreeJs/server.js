/**
 * ThreeJS Application Server
 * 
 * This server provides two main functions:
 * 1. Static file serving - Delivers HTML, JavaScript, CSS, and assets to the browser
 * 2. WebSocket communication - Enables real-time communication between clients
 * 
 * The server uses Node.js built-in HTTP module for serving files and the 'ws' library
 * for WebSocket functionality. Both servers run on the same port.
 */

// Import required modules
import http from 'http';           // Node.js HTTP server
import fs from 'fs/promises';      // File system module with promises for async file operations
import path from 'path';           // Path utilities for handling file paths
import { WebSocketServer } from 'ws'; // WebSocket server implementation

// Server configuration
const hostname = '0.0.0.0';  // Listen on all network interfaces (allows external connections)
const port = 3000;           // Port to listen on

// Get the base directory of the project (current working directory)
// This is used to resolve file paths for serving static files
const root = process.cwd();

/**
 * Create HTTP server to handle file requests
 * This server responds to HTTP requests by serving files from the project directory
 */
const server = http.createServer(async (req, res) => {
    // Handle the requested URL path
    // Default to "index.html" if the root path (/) is requested
    const filePath = req.url === '/' ? '/index.html' : req.url;

    // Resolve the full file path by joining the root directory with the requested path
    const resolvedPath = path.join(root, filePath);

    // Map file extensions to appropriate MIME types
    // This ensures browsers correctly interpret the files we send
    const mimeTypes = {
        '.html': 'text/html',               // HTML documents
        '.js': 'application/javascript',    // JavaScript files
        '.css': 'text/css',                 // CSS stylesheets
        '.json': 'application/json',        // JSON data
        '.png': 'image/png',                // PNG images
        '.jpg': 'image/jpeg',               // JPEG images
        '.gif': 'image/gif',                // GIF images
        '.ico': 'image/x-icon',             // Favicon icons
        '.svg': 'image/svg+xml',            // SVG images
    };

    // Get the file extension from the path
    const ext = path.extname(resolvedPath);

    // Determine content type based on extension, default to binary if unknown
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    try {
        // Read the requested file asynchronously
        const data = await fs.readFile(resolvedPath);

        // Send a successful response with the appropriate content type
        res.writeHead(200, { 'Content-Type': contentType });

        // Send the file data as the response body
        res.end(data);
    } catch (err) {
        // Handle file not found or other errors
        console.error(`File not found: ${resolvedPath}`);

        // Send a 404 Not Found response
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404: Not Found');
    }
});

/**
 * WebSocket Server Setup
 * Creates a WebSocket server attached to the HTTP server for real-time communication
 * This allows bidirectional communication between clients and server
 */
const wss = new WebSocketServer({ server: server });

// Handle new WebSocket connections
wss.on('connection', ws => {
    // Log when a client connects
    console.log('Client connected');

    // Handle incoming messages from clients
    ws.on('message', message => {
        // Log the received message (convert Buffer to string)
        console.log('Received:', message.toString());

        // Echo the message back to the client with confirmation
        ws.send(`Server received: ${message}`);

        // Note: In a real application, you might:
        // 1. Parse the message as JSON
        // 2. Perform some action based on the message
        // 3. Broadcast to other connected clients
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
        // Clean up any resources associated with this connection if needed
    });

    // Handle WebSocket errors
    ws.on('error', error => {
        console.error('WebSocket error:', error);
        // Implement error recovery if needed
    });

    // Send a welcome message to the newly connected client
    ws.send('Welcome to the WebSocket server!');
});

/**
 * Start the HTTP and WebSocket servers
 * Both servers share the same port (3000 by default)
 */
server.listen(port, hostname, () => {
    // Log server startup information
    console.log(`Server running at http://${hostname}:${port}/`);
    console.log(`WebSocket server also running on the same port`);

    // The application is now ready to accept HTTP requests and WebSocket connections
});
