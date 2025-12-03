const router = require("express").Router();
const admin = require("../controllers/admin.controller");

router.get("/stats", admin.stats);
router.get("/config", admin.getConfig);
router.post("/config", admin.updateConfig);

module.exports = router;
