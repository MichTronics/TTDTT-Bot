const io = require("socket.io-client");
const log = require("../global/log/log");
const Tail = require("tail-file");
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const config = require("./config/client_config");

const syslog_tail = new Tail("/var/log/syslog");
// const apache_tail = new Tail("/var/log/apache2/access.log");
// const apache_error_tail = new Tail("/var/log/apache2/error.log");
// const vhost_lail = new Tail("/var/log/apache2/other_vhosts_access.log");
let remotetrx_tail;

if (config.clientType === "RASPBERRY") {
    remotetrx_tail = new Tail("/var/log/remotetrx");
}

if (config.showLog === true) {
    syslog_tail.on('line', (line) => {
        console.log(line);
        socket.emit("discordCmdLog", line);
    })
    if (config.clientType === "RASPBERRY") {
        remotetrx_tail.on('line', (line) => {
            console.log(line);
            socket.emit("discordCmdLog", line);
        })
    }
    // apache_tail.on('line', (line) => {
    //     console.log(line);
    //     socket.emit("discordCmdLog", line);
    // })
    // vhost_lail.on('line', (line) => {
    //     console.log(line);
    //     let splitline = line.trim().split(" ");
    //     console.log(splitline[1]);
    //     //let lsplitline = splitline.length();

    //     socket.emit("discordCmdLog", line);
    // })
    // apache_error_tail.on('line', (line) => {
    //     console.log(line);
    //     socket.emit("discordCmdLog", line);
    // })
}

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
                const getHostname = await exec("hostname");
                // console.log(getHostname.stdout);
                socket.emit("discordCmdHostname", getHostname.stdout);
            } catch (error) {
                console.log(error)
            }
        }
        getHostname();
    } else if (data.cmd === "uptime") {
        async function getUpTime() {
            try{
                const getUptime = await exec("uptime");
                // console.log(getUptime.stdout);
                socket.emit("discordCmdUptime", getUptime.stdout);
            } catch (error) {
                console.log(error)
            }
        }
        getUpTime();
    } else if (data.cmd === "log" ) {
        // console.log(data);
        if (data.args === "on") {
            console.log(data);
            config.showLog = true;
            console.log(config.showLog);
            if (config.clientType === "RASPBERRY") {
                remotetrx_tail.start();
            }
            syslog_tail.start()
        }
        if (data.args === "off") {
            // console.log(data);
            config.showLog = false;
            console.log(config.showLog);
            syslog_tail.stop();
            if (config.clientType === "RASPBERRY") {
                remotetrx_tail.stop();
            }
        }
    }
})

if (config.clientType === "RASPBERRY") {
    remotetrx_tail.start();
}
syslog_tail.start();
// apache_tail.start();
// vhost_lail.start();
// apache_error_tail.start();

