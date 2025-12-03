const fs = require("fs");
const path = require("path");

const usersPath = path.join(__dirname, "../data/users.json");

module.exports = {

    list(req, res) {
        const users = JSON.parse(fs.readFileSync(usersPath));
        res.json(users);
    },

    getOne(req, res) {
        const users = JSON.parse(fs.readFileSync(usersPath));
        const user = users.find(u => u.id === req.params.id);

        if (!user) return res.json({ error: "No encontrado" });

        res.json(user);
    },

    edit(req, res) {
        const { id, user, email, role, credits, instances } = req.body;

        let users = JSON.parse(fs.readFileSync(usersPath));

        const index = users.findIndex(u => u.id === id);
        if (index === -1) return res.json({ error: "No encontrado" });

        users[index] = { ...users[index], user, email, role, credits, instances };

        fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

        res.json({ ok: true });
    },

    delete(req, res) {
        const { id } = req.body;

        let users = JSON.parse(fs.readFileSync(usersPath));
        users = users.filter(u => u.id !== id);

        fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

        res.json({ ok: true });
    }

};
