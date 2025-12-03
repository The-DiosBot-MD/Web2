const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/users.routes"));
app.use("/api/repos", require("./routes/repos.routes"));
app.use("/api/instances", require("./routes/instances.routes"));
app.use("/api/admin", require("./routes/admin.routes"));

module.exports = app;
