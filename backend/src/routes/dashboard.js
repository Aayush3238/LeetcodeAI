const express = require("express");
const { getDashboard, getAnalytics, getWeakTopics } = require("../controllers/dashboardController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.get("/", authenticate, getDashboard);
router.get("/analytics", authenticate, getAnalytics);
router.get("/weak-topics", authenticate, getWeakTopics);

module.exports = router;
