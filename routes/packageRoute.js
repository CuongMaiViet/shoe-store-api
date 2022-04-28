const router = require("express").Router();
const packageCtrl = require("../controllers/packageCtrl");

router.get("/package", packageCtrl.getAll);
router.get("/package/:codename", packageCtrl.getByCodename);

router.post("/package", packageCtrl.createNewPackage);

module.exports = router;
