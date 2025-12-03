const app = require("./app");
const http = require("http");
const server = http.createServer(app);
const websocket = require("./websocket");

// WebSocket inicial
websocket(server);

// Puerto
const PORT = 3001;

server.listen(PORT, () => {
    console.log(`🌸 Quintillisas Bots Backend corriendo en http://localhost:${PORT}`);
});
