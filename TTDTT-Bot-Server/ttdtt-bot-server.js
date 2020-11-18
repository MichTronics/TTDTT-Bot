const http = require("http").createServer();
const io = require("socket.io")(http);
const log = require("../global/log/log")

const config = require("./config/server_config");

let usersSocketId = [];
let clientsId = [];
let clientsName= [];
let clientsType = [];

// Starting Server
console.log("\033[2J");
log.logGreen(config.serverName, 'Starting....');

io.on('connection', (socket) => {

    io.emit('socketClientID', socket.client.id);

    io.emit('getClientInfo');

    socket.on('clientInfo', (data) => {
        if(clientsId.includes(data.clientId) === false) {
            log.logGreen(config.serverName,
                '^gClient ' + data.clientName + 
                ' is connected with socketId: ' + socket.client.id +
                ' \n'
            );
            usersSocketId.push(socket.client.id);
            clientsId.push(data.clientId);
            clientsName.push(data.clientName);
            clientsType.push(data.clientType);
        }
        console.log(usersSocketId);
        console.log(clientsId);
        console.log(clientsType);
        console.log(clientsName);
    });

    socket.on('disconnect', function () {
        console.log('Clients Disconnected!' + socket.client.id);
        let socket_pos = usersSocketId.indexOf(socket.client.id);
        // myEmitter.emit('client_disconnect', {
        //     //client_repeater_name: repeaters_name[socket_pos],
        //     clientId: repeatersId[socket_pos],
        //     socketId: usersSocketId[socket_pos],
        //     //remote_ip: repeaters_ip[socket_pos]
        // })
        log.logGreen(config.serverName,
            '^rClient ^w' + clientsName[socket_pos] + 
            ' ^ris disconnected with socketId:^w ' + socket.client.id +
            ' ^g\n'
        );
        usersSocketId.splice(socket_pos, 1);
        clientsId.splice(socket_pos, 1);
        clientsType.splice(socket_pos, 1);
        clientsName.splice(socket_pos, 1);
        
        console.log(usersSocketId);
        console.log(clientsId);
        console.log(clientsType);
        console.log(clientsName);
    });
})

// Socket message send when server is in maintenance
// io.use((socket, next) => {
//     const err = new Error("not authorized");
//     err.data = { content: "Please retry later" }; // additional details
//     next(err);
// });

// Start socket.io
http.listen(config.port, `${config.server_ip}`, () => {
    log.logGreen(config.serverName, `${config.serverName} is listening on port: ${config.port}.`);
})