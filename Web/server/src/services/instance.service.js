const simpleGit = require("simple-git");
const fs = require("fs");
const path = require("path");
const pm2 = require("./pm2.service");
const { sendQR, sendLog } = require("./ws.service");

const reposPath = path.join(__dirname, "../data/repos.json");
const instancesPath = path.join(__dirname, "../data/instances.json");

// Ruta raíz del sistema de instancias
const INSTANCES_ROOT = "/home/QuintillisasBots/instances";

module.exports = {

    async createInstance(userId, instanceName, repoId) {
        const repos = JSON.parse(fs.readFileSync(reposPath));
        const instances = JSON.parse(fs.readFileSync(instancesPath));

        const repo = repos.find(r => r.id === repoId);
        if (!repo) throw new Error("Repositorio no encontrado");

        const instanceId = "inst-" + Date.now();
        const instanceFolder = path.join(INSTANCES_ROOT, userId, instanceId);

        // Crear carpeta del usuario e instancia
        fs.mkdirSync(instanceFolder, { recursive: true });

        // Clonar el repo
        await simpleGit().clone(repo.url, instanceFolder);

        // INSTALACIÓN 3 PASOS
        await runCmd(`cd ${instanceFolder} && npm install`, instanceId);
        await runCmd(`cd ${instanceFolder} && yarn install`, instanceId);
        await runCmd(`cd ${instanceFolder} && npm install`, instanceId);

        // INICIAR EL BOT CON PM2 - usa "npm start"
        await pm2.start(instanceId, "npm", instanceFolder);

        // Registrar instancia
        const newInstance = {
            id: instanceId,
            userId,
            name: instanceName,
            repo: repo.name,
            folder: instanceFolder,
            status: "starting",
            logs: [],
            created: Date.now()
        };

        instances.push(newInstance);
        fs.writeFileSync(instancesPath, JSON.stringify(instances, null, 2));

        return newInstance;
    },

    async deleteInstance(id) {
        const instances = JSON.parse(fs.readFileSync(instancesPath));

        const inst = instances.find(i => i.id === id);
        if (!inst) throw new Error("Instancia no encontrada");

        // Detener proceso
        await pm2.stop(id);

        // Eliminar carpeta completa
        fs.rmSync(inst.folder, { recursive: true, force: true });

        // Guardar cambios
        const filtered = instances.filter(i => i.id !== id);
        fs.writeFileSync(instancesPath, JSON.stringify(filtered, null, 2));
    },

    // Logs en vivo (modo streaming)
    streamLogs(req, res) {
        const instId = req.params.id;

        const logFile = path.join(INSTANCES_ROOT, "logs", `${instId}.log`);
        res.setHeader("Content-Type", "text/plain");

        if (!fs.existsSync(logFile)) {
            return res.send("Aún no hay logs para esta instancia.");
        }

        fs.watchFile(logFile, () => {
            const content = fs.readFileSync(logFile, "utf-8");
            res.write(content + "\n");
        });
    }

};


/* ----------------------------------------------------
   🔥 UNIVERSAL LOG HANDLER + QR/PARING DETECTOR
---------------------------------------------------- */

function runCmd(cmd, instanceId) {
    return new Promise((resolve, reject) => {
        const p = require("child_process").exec(cmd);

        // Cada salida se analiza universalmente
        p.stdout.on("data", (d) => handleLog(instanceId, d));
        p.stderr.on("data", (d) => handleLog(instanceId, d));

        p.on("exit", resolve);
        p.on("error", reject);
    });
}


// SISTEMA UNIVERSAL — sirve para TODOS los repos de bots
function handleLog(instId, text) {

    // Enviar al panel
    sendLog(`[${instId}] ${text}`);

    // Convertir a string
    text = text.toString();

    /* ------------------------------------------------------------------
       🔍 DETECTOR #1 — CÓDIGO DE EMPAREJAMIENTO (pairing code típicos)
       ------------------------------------------------------------------ */
    const codeRegex = /(\d{6,10})/;
    if (codeRegex.test(text) && text.toLowerCase().includes("code")) {
        const match = text.match(codeRegex)[0];

        sendQR({
            type: "code",
            instanceId: instId,
            code: match
        });
    }

    /* ------------------------------------------------------------------
       🔍 DETECTOR #2 — URL de vinculación (muchos bots nuevos usan links)
       ------------------------------------------------------------------ */
    const urlRegex = /(https?:\/\/[^\s]+)/;
    if (urlRegex.test(text)) {
        const url = text.match(urlRegex)[0];

        sendQR({
            type: "url",
            instanceId: instId,
            url
        });
    }

    /* ------------------------------------------------------------------
       🔍 DETECTOR #3 — QR Base64 directo (data:image/png;base64)
       ------------------------------------------------------------------ */
    if (text.includes("data:image") || text.includes("base64")) {
        sendQR({
            type: "base64",
            instanceId: instId,
            base64: text.trim()
        });
    }

    /* ------------------------------------------------------------------
       🔍 DETECTOR #4 — QR ASCII (Baileys imprime estos cuadrados █▀▄)
       ------------------------------------------------------------------ */
    if (text.includes("█") || text.includes("▀") || text.includes("▄")) {
        sendQR({
            type: "ascii",
            instanceId: instId,
            qr: text
        });
    }

    /* ------------------------------------------------------------------
       🔍 Guardado permanente en archivo
       ------------------------------------------------------------------ */
    saveLog(instId, text);
}


/* ----------------------------------------------------
   📁 GUARDAR LOGS
---------------------------------------------------- */
function saveLog(instId, text) {
    const logFile = path.join(INSTANCES_ROOT, "logs", `${instId}.log`);

    fs.mkdirSync(path.dirname(logFile), { recursive: true });

    fs.appendFileSync(logFile, text + "\n");
}
