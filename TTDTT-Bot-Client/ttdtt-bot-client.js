const io = require("socket.io-client");
const log = require("../global/log/log")

const config = require("./config/client_config");

// Starting Client
console.log("\033[2J");
log.logGreen(config.client_name, 'Starting....');

// Connect to the server
socket = io.connect(`${config.host_url}:${config.host_port}`);

// Socket event connect
//socket.on('connect', () => {
//    log.logGreen(config.client_name, 'Connected to server....');
//})

socket.on('socketClientID', function (socketClientID) {
    log.logGreen(config.client_name, 'Connection to server established. SocketID is ' + socketClientID);
    //console.log('Connection to server established. SocketID is' + socketClientID);
});

// Socket error message when server is in maintenance
socket.on("connect_error", err => {
    log.logRed(config.client_name, `Connect error: ${err instanceof Error}`); // true
    log.logRed(config.client_name, `Connect error: ${err.message}`); // not authorized
    log.logRed(config.client_name, `Connect error: ${err.data.content}`); // { content: "Please retry later" }
});

// Socket event getClientInfo
socket.on('getClientInfo', () => {
    socket.emit('clientInfo', {
        clientId: config.client_id,
        clientType: config.client_type,
        clientName: config.client_name,
    });
});
