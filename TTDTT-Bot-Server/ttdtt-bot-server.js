const http = require("http").createServer();
const io = require("socket.io")(http);
const log = require("../global/log/log")

const config = require("./config/server_config");

let users_socket_id = [];
let clients_id = [];

console.log("\033[2J");

io.on('connection', (socket) => {

    io.emit('getClientInfo');

    socket.on('clientInfo', (data) => {
        if(clients_id.includes(data.clientId) === false) {
            log.logGreen(config.serverName,
                'socketId: ' + socket.client.id + 
                ', clientId: ' + data.clientId + 
                ', clientType: ' + data.clientType + 
                ', clientName: ' + data.clientName + 
                ', clientIp: ' + socket.request.connection.remoteAddress + 
                ' is connected...\n'
            );
            users_socket_id.push(socket.client.id);
            clients_id.push(data.clientId);
        }
        // console.log(`${users_socket_id}  ${clients_id}`);
    })
})

// Offline message
// io.use((socket, next) => {
//     const err = new Error("not authorized");
//     err.data = { content: "Please retry later" }; // additional details
//     next(err);
// });

http.listen(config.port, `${config.server_ip}`, () => {
    console.log(`TTDTT-Bot-Server is listening on port: ${config.port}.`);
})