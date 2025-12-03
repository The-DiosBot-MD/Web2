const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const usersPath = path.join(__dirname, "../data/users.json");

module.exports = {

    login(req, res) {
        const { user, pass } = req.body;

        const users = JSON.parse(fs.readFileSync(usersPath));
        const found = users.find(u => u.user === user);

        if (!found) return res.json({ error: "Usuario no encontrado" });

        if (!bcrypt.compareSync(pass, found.pass))
            return res.json({ error: "Contraseña incorrecta" });

        const token = jwt.sign({
            id: found.id,
            user: found.user,
            role: found.role
        }, "SECRETO-MIKU");

        res.json({
            ok: true,
            token,
            user: found
        });
    },

    register(req, res) {
        const { user, email, pass } = req.body;

        const users = JSON.parse(fs.readFileSync(usersPath));

        if (users.some(u => u.user === user))
            return res.json({ error: "El usuario ya existe" });

        const newUser = {
            id: "user-" + Date.now(),
            user,
            email,
            pass: bcrypt.hashSync(pass, 10),
            role: "user",
            credits: 100,
            instances: 0
        };

        users.push(newUser);
        fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

        res.json({ ok: true, msg: "Usuario creado" });
    }

};
