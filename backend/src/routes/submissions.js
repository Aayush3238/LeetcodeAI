const express = require("express");
const { getSubmissions, analyzeSubmission, detectPattern } = require("../controllers/submissionController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.get("/", authenticate, getSubmissions);
router.post("/analyze", authenticate, analyzeSubmission);
router.post("/detect-pattern", authenticate, detectPattern);

module.exports = router;
