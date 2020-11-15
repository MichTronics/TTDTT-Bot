const term = require("terminal-kit").terminal;
const Time = require("../time/time");

function logBlue(servername, cm) {
    const time = Time.getTime();
    term.bold(
        `^m[^w` +
        time.hour +
        `^r:^w` +
        time.min +
        `^r:^w` +
        time.sec +
        `^r:^w` +
        time.millisec +
        `^m]^b ` +
        `^y>>>^r` +
        servername +
        `^y<<<^b ` +
        cm +
        `\n`
    )
}

function logGreen(servername, cm) {
    const time = Time.getTime();
    term.bold(
        `^m[^w` +
        time.hour +
        `^r:^w` +
        time.min +
        `^r:^w` +
        time.sec +
        `^r:^w` +
        time.millisec +
        `^m]^b ` +
        `^y>>>^r` +
        servername +
        `^y<<<^g ` +
        cm +
        `\n`
    )
}

function logRed(servername, cm) {
    const time = Time.getTime();
    term.bold(
        `^m[^w` +
        time.hour +
        `^r:^w` +
        time.min +
        `^r:^w` +
        time.sec +
        `^r:^w` +
        time.millisec +
        `^m]^b ` +
        `^y>>>^r` +
        servername +
        `^y<<<^r ` +
        cm +
        `\n`
    )
}

function logYellow(servername, cm) {
    const time = Time.getTime();
    term.bold(
        `^m[^w` +
        time.hour +
        `^r:^w` +
        time.min +
        `^r:^w` +
        time.sec +
        `^r:^w` +
        time.millisec +
        `^m]^b ` +
        `^y>>>^r` +
        servername +
        `^y<<<^y ` +
        cm +
        `\n`
    )
}

module.exports = { logBlue, logGreen, logRed, logYellow };