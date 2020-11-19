const http = require("http").createServer();
const io = require("socket.io")(http);
const log = require("../global/log/log");
const { Telegraf } = require("telegraf");
const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

const config = require("./config/server_config");
const token = require("./config/server_secrets");

let usersSocketId = [];
let clientsId = [];
let clientsName= [];
let clientsType = [];

const discord = new Discord.Client();



// Starting Server
console.log("\033[2J");
log.logGreen(config.serverName, 'Starting....');

//
// Socket.io
//

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
            if(config.debug === true) {
                console.log(usersSocketId);
                console.log(clientsId);
                console.log(clientsType);
                console.log(clientsName);
            }
        }
        
    });

    socket.on('disconnect', function () {
        let socket_pos = usersSocketId.indexOf(socket.client.id);
        // myEmitter.emit('client_disconnect', {
        //     //client_repeater_name: repeaters_name[socket_pos],
        //     clientId: repeatersId[socket_pos],
        //     socketId: usersSocketId[socket_pos],
        //     //remote_ip: repeaters_ip[socket_pos]
        // })
        
        if(config.debug === true) {
            console.log(usersSocketId);
            console.log(clientsId);
            console.log(clientsType);
            console.log(clientsName);
        }
        log.logGreen(config.serverName,
            '^rClient ^w' + clientsName[socket_pos] + 
            ' ^ris disconnected with socketId:^w ' + socket.client.id +
            ' ^g\n'
        );
        usersSocketId.splice(socket_pos, 1);
        clientsId.splice(socket_pos, 1);
        clientsType.splice(socket_pos, 1);
        clientsName.splice(socket_pos, 1);
    });

    setInterval(function() {
        startTime = Date.now();
        socket.emit('ping');
    }, 1000);
    
    socket.on('pong', (data) => {
        latency = Date.now() - startTime;
        if(config.debug === true) {
            if(latency >= 10) {
                console.log(`## PING IS HIGH ## Latency is: ${latency}ms to: ${data.clientName} `);
                log.logGreen(config.serverName,
                    '^r## PING IS HIGH ## Latency is: ^w' + latency + 
                    '^r ms to: ^w' + data.clientName
                );
            }
            log.logGreen(config.serverName,
                '## PING ## Latency is: ^w' + latency + 
                '^g ms to: ^w' + data.clientName
            );
            //console.log(`** PING ** Latency is: ${latency}ms to: ${data.client_name} `);
        }
    });
})

// Socket message send when server is in maintenance
// io.use((socket, next) => {
//     const err = new Error("not authorized");
//     err.data = { content: "Please retry later" }; // additional details
//     next(err);
// });

//
// DiscordJS
//

discord.on('ready', (socket) => {
    log.logGreen(config.serverName,
        '^g' + config.serverName + 
        ' is connected to Discord.'
    );
})



//
// Telegram
//


//
// TeamSpeak Query
//


// Bot start socket.io, Discord
http.listen(config.port, `${config.server_ip}`, () => {
    log.logGreen(config.serverName, `${config.serverName} is listening on port: ${config.port}.`);
})
discord.login(token.discord_bot);