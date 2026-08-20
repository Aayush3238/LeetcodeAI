const express = require("express");
const { getGraph, getGraphStats, getNodeDetails } = require("../controllers/graphController");

const router = express.Router();

router.get("/", getGraph);
router.get("/stats", getGraphStats);
router.get("/node/:nodeId(*)", getNodeDetails);

module.exports = router;
