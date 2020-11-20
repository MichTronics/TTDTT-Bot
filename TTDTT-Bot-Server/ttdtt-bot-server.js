const http = require("http").createServer();
const io = require("socket.io")(http);
const log = require("../global/log/log");
const { Telegraf } = require("telegraf");
const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const EventEmitter = require("events");

const config = require("./config/server_config");
const token = require("./config/server_secrets");

let usersSocketId = [];
let clientsId = [];
let clientsName= [];
let clientsType = [];
let clientsIp = [];

class MyEmitter extends EventEmitter {};

const discord = new Discord.Client();
const myEmitter = new MyEmitter;

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
                ' is connected with socketId: ' + socket.client.id 
            );
            usersSocketId.push(socket.client.id);
            clientsId.push(data.clientId);
            clientsName.push(data.clientName);
            clientsType.push(data.clientType);
            clientsIp.push(socket.request.connection.remoteAddress);
            if(config.debug === true) {
                console.log(usersSocketId);
                console.log(clientsId);
                console.log(clientsType);
                console.log(clientsName);
                console.log(clientsIp);
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
            console.log(clientsIp);
        }

        log.logGreen(config.serverName,
            '^rClient ^w' + clientsName[socket_pos] + 
            ' ^ris disconnected with socketId:^w ' + socket.client.id
        );

        usersSocketId.splice(socket_pos, 1);
        clientsId.splice(socket_pos, 1);
        clientsType.splice(socket_pos, 1);
        clientsName.splice(socket_pos, 1);
        clientsIp.splice(socket_pos, 1);
    });

    // Ping every 10 sec
    setInterval(function() {
        startTime = Date.now();
        socket.emit('ping');
    }, 5000);
    
    socket.on('pong', (data) => {
        latency = Date.now() - startTime;
        if(latency >= 10) {
            console.log(`## PING IS HIGH ## Latency is: ${latency}ms to: ${data.clientName} `);
            log.logGreen(config.serverName,
                '^r## PING IS HIGH ## Latency is: ^w' + latency + 
                '^r ms to: ^w' + data.clientName
            );
        }
        if(config.debug === true) {
            log.logGreen(config.serverName,
                '## PING ## Latency is: ^w' + latency + 
                '^g ms to: ^w' + data.clientName
            );
        }
    });

    socket.on("discordCmdHostname", (data) => {
        myEmitter.emit("outputHostname", data);
    });

    socket.on('discordCmdUptime', (data) => {
        myEmitter.emit('outputUptime', data);
    })
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

    let botChannel = discord.channels.cache.get(config.dc_bot_chanId);
    const embed = new MessageEmbed()
        .setTitle("Connect Info")
        .setColor(0x00ff00)
        .setDescription(`${config.serverName} is connected to Discord.`);
        botChannel.send(embed);
        // if(config.discord_output === true) {
        //     tb.telegram.sendMessage(config.tg_cbjunkiesNs_chanId, 'CBJunkies-Bot is geconnect met Discord en Telegram.');
        // }

    myEmitter.on("outputHostname", (output) => {
        botChannel.send("Hostname = " + output);
    })

    myEmitter.on("outputUptime", (output) => {
        botChannel.send("Uptime = " + output);
    })
});

discord.on('message', (msg) => {
    if(!msg.content.startsWith(config.prefix) || msg.author.bot) return;
    const args = msg.content.slice(config.prefix.length).trim().split(" ");
    const cmds = args.shift().toLowerCase();
    let botChannel = discord.channels.cache.get(config.dc_bot_chanId);
    if (config.debug === true) {
        console.log(msg);
    }
    if (cmds === "help") {
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Help command')
            .setDescription('Help asked')
            .addFields(
                // { name: '\u200B', value: '\u200B' },
                { name: `${config.prefix}help`, value: 'Show this help', inline: true },
                { name: `${config.prefix}client <command>`, value: `list: List all clients`, inline: true },
                { name: `${config.prefix}hostname`, value: "Get real hostnames from clients", inline: true },
                { name: `${config.prefix}uptime`, value: "Get uptime from clients", inline: true },
                { name: `${config.prefix}debug <on/off>`, value: "Debug messages on/off", inline: true },

            )
            .setTimestamp()
            botChannel.send(embed);   
    } else if (cmds === "client" && args.length <= 0) {
        const embed = new MessageEmbed()
            .setTitle(`Gebruik command ${config.prefix}${cmds}`)
            .setColor(0xff0000)
            .setDescription(`
                ${config.prefix}${cmds} list : List all connected clients.
            `);
            botChannel.send(embed);
    } else if (cmds === "client" && args[0] === "list") {
        for ( let x = 0; x < clientsName.length; x++) {
            botChannel.send('Id: ' + clientsId[x] + '  Name: ' + clientsName[x] + '  Ip: ' + clientsIp[x]);
        }
    } else if (cmds === "hostname") {
        io.emit("discordCmd", {
            cmd: "hostname"
        });
    } else if (cmds === "uptime") {
        io.emit("discordCmd", { 
            cmd: "uptime" 
        });
    } else if(cmds === "debug" && args[0] === "on") {
        config.debug = true;
        botChannel.send(`
            Debug is on!
        `)
    } else if(cmds === "debug" && args[0] === "off") {
        config.debug = false;
        botChannel.send(`
            Debug is off!
        `)
    }
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