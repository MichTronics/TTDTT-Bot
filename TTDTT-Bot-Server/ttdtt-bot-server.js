const http = require("http").createServer();
const io = require("socket.io")(http);
const term = require("terminal-kit").terminal;

const config = require("./config/server_config");

let users_socket_id = [];
let clients_id = [];

io.on('connection', (socket) => {

    io.emit('getClientInfo');

    socket.on('clientInfo', (data) => {
        if(clients_id.includes(data.clientId) === false) {
            console.log(
                'Client with socketId: ' + socket.client.id + 
                ', clientId: ' + data.clientId + 
                ', clientType: ' + data.clientType + 
                ', clientName: ' + data.clientName + 
                ', clientIp: ' + socket.request.connection.remoteAddress + 
                ' is connected...\n'
            );
            users_socket_id.push(socket.client.id);
            clients_id.push(data.clientId);
        }
        console.log(`${users_socket_id}  ${clients_id}`);
    })
})

http.listen(config.port, `${config.server_ip}`, () => {
    console.log(`TTDTT-Bot-Server is listening on port: ${config.port}.`);
})