const router = require("express").Router();
const userCtrl = require("../controllers/userCtrl");

router.post("/user/register",  userCtrl.register);
router.post("/user/:verify", userCtrl.verify);

module.exports = router;
