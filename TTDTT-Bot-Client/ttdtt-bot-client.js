const io = require("socket.io-client");
const term = require("terminal-kit").terminal;

const config = require("./config/client_config");

socket = io.connect(`${config.host_url}:${config.host_port}`);

console.log("\033[2J")

socket.on('connect', () => {
    term.green.bold('TTDTT-Bot-Client Connected....\n');
})

socket.on('getClientInfo', () => {
    socket.emit('clientInfo', {
        clientId: config.client_id,
        clientType: config.client_type,
        clientName: config.client_name,
    });
});