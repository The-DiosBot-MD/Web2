const router = require("express").Router();
const instances = require("../controllers/instances.controller");

router.get("/", instances.list);
router.post("/create", instances.create);
router.post("/delete", instances.remove);
router.get("/logs/:id", instances.logs);

module.exports = router;
