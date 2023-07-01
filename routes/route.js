const express = require("express");
const router = express.Router();

const syncdata = require("../controller/syncdata");

router.post("/syncdata", syncdata.syncGetData);
router.post("/getewons", syncdata.getewons);

module.exports = router;
