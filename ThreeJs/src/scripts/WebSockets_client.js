/**
 * WebSocket Client Module
 * 
 * This module establishes and manages a WebSocket connection to the server, enabling:
 * - Real-time communication between client and server
 * - Device type detection (mobile vs desktop)
 * - Structured message exchange using JSON
 * - Event handling for connection, messages, errors, and disconnection
 * 
 * The WebSocket connection allows the 3D application to receive real-time updates
 * and send user interactions to the server.
 */

// Create new WebSocket connection to the server
// Note: Replace the IP address with your server's address or use relative addressing
const socket = new WebSocket('ws://192.168.0.150:3000');

/**
 * Connection established event handler
 * Executes when the WebSocket connection is successfully established
 */
socket.addEventListener('open', function (event) {
    console.log("WebSocket connection established");

    // Send initial greeting to the server
    socket.send('Hello Server');

    // Detect device type using the User-Agent string
    // This allows different behavior based on whether the client is mobile or desktop
    if (navigator.userAgent.match(/Android/i) || 
        navigator.userAgent.match(/iPhone/i) || 
        navigator.userAgent.match(/iPad/i)) {
        // Mobile device detected
        console.log("Mobile device connected");

        // Create a structured message object
        const connectionMessage = { 
            type: 'message', 
            message: "Edge device connected"
        };

        // Send the message as JSON string
        socket.send(JSON.stringify(connectionMessage));
    } else {
        // Desktop device detected
        console.log("Desktop device connected");

        // Create a structured message object
        const connectionMessage = { 
            type: 'message', 
            message: "PC device connected"
        };

        // Send the message as JSON string
        socket.send(JSON.stringify(connectionMessage));

        // Additional desktop-specific setup could go here
        // For example, setting up GUI event listeners
    }
});

/**
 * Message received event handler
 * Executes when a message is received from the server
 */
socket.addEventListener('message', function (event) {
    console.log("Message from server:", event.data);

    // Here you could:
    // 1. Parse JSON messages: const data = JSON.parse(event.data);
    // 2. Handle different message types: if (data.type === 'update') { ... }
    // 3. Update the 3D scene based on received data
});

/**
 * Connection closed event handler
 * Executes when the WebSocket connection is closed
 */
socket.addEventListener('close', function (event) {
    console.log("WebSocket connection closed");
    console.log("Code: " + event.code + " Reason: " + event.reason);

    // Here you could implement reconnection logic or notify the user
});

/**
 * Error event handler
 * Executes when there's an error with the WebSocket connection
 */
socket.addEventListener('error', function (event) {
    console.error("WebSocket error:", event);

    // Here you could implement error recovery or fallback mechanisms
});

// Export the socket for use in other modules
export { socket };
