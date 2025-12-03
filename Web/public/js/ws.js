// Cambia esto si tu backend está en otro puerto
const WS_URL = "ws://localhost:3001";

let ws = null;
let reconnectTimeout = null;

function connectWebSocket() {
    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
        console.log("🌸 WebSocket conectado");
    };

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            handleWSMessage(data);
        } catch {}
    };

    ws.onclose = () => {
        console.log("❌ WebSocket desconectado, reintentando...");
        reconnectTimeout = setTimeout(connectWebSocket, 2000);
    };
}

connectWebSocket();


// 👉 Aquí manejaremos todos los tipos de mensajes recibidos
function handleWSMessage(data) {

    // LOGS
    if (data.type === "log") {
        appendLog(data.log);
    }

    // QR / CODE / URL
    if (data.type === "qr") {
        renderQR(data);
    }

}
