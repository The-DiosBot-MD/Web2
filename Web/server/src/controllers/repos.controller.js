const fs = require("fs");
const path = require("path");

const reposPath = path.join(__dirname, "../data/repos.json");

module.exports = {

    list(req, res) {
        const repos = JSON.parse(fs.readFileSync(reposPath));
        res.json(repos);
    },

    add(req, res) {
        const { name, url, desc, type } = req.body;

        const repos = JSON.parse(fs.readFileSync(reposPath));

        repos.push({
            id: "repo-" + Date.now(),
            name,
            url,
            desc,
            type: type || "nodejs"
        });

        fs.writeFileSync(reposPath, JSON.stringify(repos, null, 2));

        res.json({ ok: true });
    },

    remove(req, res) {
        const { id } = req.body;

        let repos = JSON.parse(fs.readFileSync(reposPath));
        repos = repos.filter(r => r.id !== id);

        fs.writeFileSync(reposPath, JSON.stringify(repos, null, 2));

        res.json({ ok: true });
    }

};
