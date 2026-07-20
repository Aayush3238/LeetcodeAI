const express = require("express");
const { getProblems, getTopics } = require("../controllers/problemController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.get("/", authenticate, getProblems);
router.get("/topics", authenticate, getTopics);

module.exports = router;
