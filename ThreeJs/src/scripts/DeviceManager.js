import {socket} from './WebSockets_client.js';

// //navigator helper class to determine if device is mobile
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