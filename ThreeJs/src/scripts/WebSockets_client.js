// Create new WS connection to spec URL

const socket = new WebSocket('ws://192.168.0.150:3000'); // Replace with your IP
// Execute when connection is successfully established

socket.addEventListener('open', function (event) {
    console.log("Websocket connection started");
    //send message to websocket server
    socket.send('Hello Server');
    //navigator helper class to determine if device is mobile
    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
        console.log("Mobile OS Android Device connected ");
        const connectionMessage = { type:'message', message:"Edge device connected"}
        socket.send(JSON.stringify(connectionMessage));
    } else {
        console.log("user is connected on pc");
        const connectionMessage = { type:'message', message:"PC device connected"};
        socket.send(JSON.stringify(connectionMessage));

        //listen for GUI events on user end

    }
});

//Listen for messages and execute when message is received from server
socket.addEventListener('message', function (event) {
    console.log("Message from server: ", event.data);
});

// When connection is closed, provide close code and reason
socket.addEventListener('close', function (event) {
    console.log("Websocket connection closed");
    console.log("Code: " + event.code + "Reason: " + event.reason);
});

//If err
socket.addEventListener('error', function (event) {
    console.log("Error from server: ", event);
})

export {socket};