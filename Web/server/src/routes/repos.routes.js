const router = require("express").Router();
const repos = require("../controllers/repos.controller");

router.get("/", repos.list);
router.post("/add", repos.add);
router.post("/remove", repos.remove);

module.exports = router;
