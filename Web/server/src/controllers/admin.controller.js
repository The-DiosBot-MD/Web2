const fs = require("fs");
const path = require("path");

const usersPath = path.join(__dirname, "../data/users.json");
const reposPath = path.join(__dirname, "../data/repos.json");
const instPath  = path.join(__dirname, "../data/instances.json");
const configPath = path.join(__dirname, "../data/configs.json");

module.exports = {

    stats(req, res) {
        const users = JSON.parse(fs.readFileSync(usersPath));
        const repos = JSON.parse(fs.readFileSync(reposPath));
        const inst  = JSON.parse(fs.readFileSync(instPath));

        res.json({
            users: users.length,
            repos: repos.length,
            instances: inst.length
        });
    },

    getConfig(req, res) {
        const config = JSON.parse(fs.readFileSync(configPath));
        res.json(config);
    },

    updateConfig(req, res) {
        const { maxInstancesPerUser, startingCredits, installPath } = req.body;

        const newConfig = {
            maxInstancesPerUser,
            startingCredits,
            installPath
        };

        fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));
        res.json({ ok: true });
    }

};
