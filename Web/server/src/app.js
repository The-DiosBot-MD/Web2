const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auth", require("./routes/auth.routes"));
app.use("/users", require("./routes/users.routes"));
app.use("/repos", require("./routes/repos.routes"));
app.use("/instances", require("./routes/instances.routes"));
app.use("/admin", require("./routes/admin.routes"));

module.exports = app;
