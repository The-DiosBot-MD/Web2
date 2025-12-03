const logsBox = document.getElementById("logs");

// Añade logs al panel en vivo
function appendLog(text) {
    if (!logsBox) return;
    
    logsBox.textContent += "\n" + text;
    logsBox.scrollTop = logsBox.scrollHeight;
}
