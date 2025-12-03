const qrBox = document.getElementById("qrBox");
const qrText = document.getElementById("qrText");
const qrImage = document.getElementById("qrImage");
const qrAscii = document.getElementById("qrAscii");

// Limpia y muestra
function renderQR(data) {
    
    const id = sessionStorage.getItem("qr_instance_id");
    if (data.instanceId !== id) return; // solo QR de esta instancia

    qrBox.style.display = "block";

    // Código numérico
    if (data.type === "code") {
        qrText.textContent = "Código de emparejamiento: " + data.code;
        qrImage.style.display = "none";
        qrAscii.style.display = "none";
        return;
    }

    // URL
    if (data.type === "url") {
        qrText.innerHTML = `Enlace de vinculación:<br><a href="${data.url}" target="_blank">${data.url}</a>`;
        qrImage.style.display = "none";
        qrAscii.style.display = "none";
        return;
    }

    // Base64
    if (data.type === "base64") {
        qrText.textContent = "";
        qrImage.src = data.base64;
        qrImage.style.display = "block";
        qrAscii.style.display = "none";
        return;
    }

    // ASCII QR (Baileys)
    if (data.type === "ascii") {
        qrText.textContent = "";
        qrImage.style.display = "none";
        qrAscii.textContent = data.qr;
        qrAscii.style.display = "block";
        return;
    }
}
