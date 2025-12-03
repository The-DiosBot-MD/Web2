const ws = require("../websocket");

module.exports = {

    sendQR(qr) {
        ws.broadcast({ type: "qr", qr });
    },

    sendLog(log) {
        ws.broadcast({ type: "log", log });
    }

};
