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
const validate = require("../middleware/validate");
const {
  sendMessageSchema,
  createConversationSchema,
  generateRevisionPlanSchema,
  explainCodeSchema,
} = require("../validators/ai");

const router = express.Router();

router.get("/conversations", authenticate, getConversations);
router.post("/conversations", authenticate, validate(createConversationSchema), createConversation);
router.post("/chat", authenticate, validate(sendMessageSchema), sendMessage);
router.post("/chat/stream", authenticate, validate(sendMessageSchema), chatStream);
router.post("/revision-plan", authenticate, validate(generateRevisionPlanSchema), generateRevisionPlan);
router.post("/explain", authenticate, validate(explainCodeSchema), explainCode);

module.exports = router;
