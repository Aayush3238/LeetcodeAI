const express = require("express");
const { getProfile, getStatus, connect, sync, disconnect, saveSession, getSessionStatus } = require("../controllers/leetcodeController");
const { authenticate } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { connectLeetcodeSchema, saveSessionSchema } = require("../validators/leetcode");

const router = express.Router();

router.get("/status", authenticate, getStatus);
router.get("/session-status", authenticate, getSessionStatus);
router.get("/profile/:username", authenticate, getProfile);
router.post("/connect", authenticate, validate(connectLeetcodeSchema), connect);
router.post("/sync", authenticate, sync);
router.post("/session", authenticate, validate(saveSessionSchema), saveSession);
router.post("/disconnect", authenticate, disconnect);

module.exports = router;
