const express = require("express");
const { getSubmissions, analyzeSubmission, detectPattern } = require("../controllers/submissionController");
const { authenticate } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { analyzeSubmissionSchema, detectPatternSchema } = require("../validators/ai");

const router = express.Router();

router.get("/", authenticate, getSubmissions);
router.post("/analyze", authenticate, validate(analyzeSubmissionSchema), analyzeSubmission);
router.post("/detect-pattern", authenticate, validate(detectPatternSchema), detectPattern);

module.exports = router;
