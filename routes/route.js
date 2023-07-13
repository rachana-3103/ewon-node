const express = require("express");
const router = express.Router();

const syncdata = require("../controller/syncdata");

router.post("/syncdata", syncdata.syncGetData);
router.post("/getdata", syncdata.getData);
router.post("/getewons", syncdata.getewons);
router.get("/syncdataGraph", syncdata.syncdataGraph);



module.exports = router;
