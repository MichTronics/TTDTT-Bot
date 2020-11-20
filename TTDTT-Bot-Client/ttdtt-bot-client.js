const io = require("socket.io-client");
const log = require("../global/log/log");
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const config = require("./config/client_config");

// Starting Client
console.log("\033[2J");
log.logGreen(config.clientName, "Starting....");

// Connect to the server
socket = io.connect(`${config.hostUrl}:${config.hostPort}`);

// Socket event connect
//socket.on('connect', () => {
//    log.logGreen(config.client_name, 'Connected to server....');
//})

// Socket event send ping
socket.on("ping", function() {
    socket.emit("pong", {
        clientName: config.clientName
    });
});

// Socket event send socketClietID
socket.on("socketClientID", function (socketClientID) {
    log.logGreen(config.clientName, "Connection to server established. SocketID is " + socketClientID);
});

// Socket error message when server is in maintenance
socket.on("connect_error", err => {
    log.logRed(config.clientName, `Connect error: ${err instanceof Error}`); // true
    log.logRed(config.clientName, `Connect error: ${err.message}`); // not authorized
    log.logRed(config.clientName, `Connect error: ${err.data.content}`); // { content: "Please retry later" }
});

// Socket event getClientInfo
socket.on("getClientInfo", () => {
    socket.emit("clientInfo", {
        clientId: config.clientId,
        clientType: config.clientType,
        clientName: config.clientName,
    });
});

socket.on("discordCmd", (data) => {
    if (data.cmd === "hostname") {
        async function getHostname() {
            try{
                const getHostname = await exec('hostname');
                console.log(getHostname.stdout);
                socket.emit("discordCmdHostname", getHostname.stdout);
            } catch (error) {
                console.log(error)
            }
        }
        getHostname();
    }
})
