const express = require("express");
const {
  getConversations,
  createConversation,
  sendMessage,
  chatStream,
  generateRevisionPlan,
  explainCode,
} = require("../controllers/aiController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.get("/conversations", authenticate, getConversations);
router.post("/conversations", authenticate, createConversation);
router.post("/chat", authenticate, sendMessage);
router.post("/chat/stream", authenticate, chatStream);
router.post("/revision-plan", authenticate, generateRevisionPlan);
router.post("/explain", authenticate, explainCode);

module.exports = router;
