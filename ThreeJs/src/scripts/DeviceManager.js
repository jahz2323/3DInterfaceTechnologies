/**
 * Device Manager Module
 * 
 * This module was originally designed to handle device detection and management:
 * - Detect whether the client is running on mobile or desktop
 * - Send appropriate connection messages to the server
 * - Potentially handle device-specific behaviors
 * 
 * NOTE: This functionality has been moved to WebSockets_client.js
 * This file is currently not active but is kept for reference or future expansion.
 * The device detection logic could be expanded in the future to:
 * - Adjust rendering quality based on device capabilities
 * - Enable/disable features based on device type
 * - Handle device orientation and motion events on mobile
 * - Implement responsive UI adjustments
 */

import {socket} from './WebSockets_client.js';

// Device detection code (currently inactive)
// This code has been moved to WebSockets_client.js
// 
// // Detect if device is mobile using User-Agent string
// if(navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
//     console.log("Mobile OS Android Device connected ");
//     const connectionMessage = {type:'message', message:'Edge device connected!'};
//     socket.send(JSON.stringify(connectionMessage));
// }
// else {
//     console.log("user is connected on pc");
//     const connectionMessage = {type:'message', message:'PC device connected!'};
//     socket.send(JSON.stringify(connectionMessage));
// }

// Future device-specific functionality could be implemented here
