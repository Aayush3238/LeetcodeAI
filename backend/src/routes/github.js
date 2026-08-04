const express = require("express");
const { getStatus, getRepos, getStats, getRepoStats, disconnect } = require("../controllers/githubController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.get("/status", authenticate, getStatus);
router.get("/repos", authenticate, getRepos);
router.get("/stats", authenticate, getStats);
router.get("/repo/:owner/:repo", authenticate, getRepoStats);
router.post("/disconnect", authenticate, disconnect);

module.exports = router;
