const WebSocket = require("ws");

let wss;
let connections = [];

module.exports = (server) => {
    wss = new WebSocket.Server({ server });

    wss.on("connection", ws => {
        connections.push(ws);

        ws.on("close", () => {
            connections = connections.filter(c => c !== ws);
        });
    });
};

module.exports.broadcast = (data) => {
    connections.forEach(ws => {
        if (ws.readyState === 1) {
            ws.send(JSON.stringify(data));
        }
    });
};
