const express = require("express");
const { getProfile, getStatus, connect, sync, disconnect } = require("../controllers/leetcodeController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.get("/status", authenticate, getStatus);
router.get("/profile/:username", authenticate, getProfile);
router.post("/connect", authenticate, connect);
router.post("/sync", authenticate, sync);
router.post("/disconnect", authenticate, disconnect);

module.exports = router;
