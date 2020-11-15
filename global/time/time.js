function getTime() {
    let newDate = new Date();

    let hour = newDate.getHours();
    hour = (hour < "10" ? "0" : "") + hour;

    let min = newDate.getMinutes();
    min = (min < "10" ? "0" : "") + min;

    let sec = newDate.getSeconds();
    sec = (sec < "10" ? "0" : "") + sec;

    let millisec = newDate.getMilliseconds();
    millisec = (millisec < "100" ? "0" : "") + millisec;

    // console.log(hour + ':' + min + ':' + sec + ':' + millisec);
    return { hour, min, sec, millisec };
}

module.exports = { getTime }