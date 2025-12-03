const instanceService = require("../services/instance.service");
const fs = require("fs");
const path = require("path");

const instancesPath = path.join(__dirname, "../data/instances.json");

module.exports = {

    // ===========================
    // LISTAR TODAS LAS INSTANCIAS
    // ===========================
    list(req, res) {
        try {
            const list = JSON.parse(fs.readFileSync(instancesPath));
            res.json(list);
        } catch (e) {
            res.json({ ok: false, error: e.message });
        }
    },

    // ===========================
    // CREAR INSTANCIA
    // ===========================
    async create(req, res) {
        const { userId, instanceName, repoId } = req.body;

        try {
            const result = await instanceService.createInstance(
                userId,
                instanceName,
                repoId
            );
            res.json({ ok: true, instance: result });
        } catch (e) {
            console.log(e);
            res.json({ ok: false, error: e.message });
        }
    },

    // ===========================
    // ELIMINAR INSTANCIA
    // ===========================
    async remove(req, res) {
        const { id } = req.body;

        try {
            await instanceService.deleteInstance(id);
            res.json({ ok: true });
        } catch (e) {
            res.json({ ok: false, error: e.message });
        }
    },

    // ===========================
    // LOGS EN VIVO DE LA INSTANCIA
    // ===========================
    logs(req, res) {
        try {
            instanceService.streamLogs(req, res);
        } catch (e) {
            res.json({ ok: false, error: e.message });
        }
    }

};
