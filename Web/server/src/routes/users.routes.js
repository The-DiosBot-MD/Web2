const router = require("express").Router();
const users = require("../controllers/users.controller");

router.get("/", users.list);
router.get("/:id", users.getOne);
router.post("/edit", users.edit);
router.post("/delete", users.delete);

module.exports = router;
