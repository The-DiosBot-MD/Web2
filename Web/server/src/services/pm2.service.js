const pm2 = require("pm2");

module.exports = {

    start(name, script, cwd) {
        return new Promise((resolve, reject) => {
            pm2.connect(() => {
                pm2.start({
                    name,
                    script,
                    cwd,
                    interpreter: "node",
                    watch: false
                }, err => {
                    if (err) return reject(err);
                    resolve(true);
                });
            });
        });
    },

    stop(name) {
        return new Promise((resolve, reject) => {
            pm2.connect(() => {
                pm2.delete(name, err => {
                    if (err) return reject(err);
                    resolve(true);
                });
            });
        });
    }

};
