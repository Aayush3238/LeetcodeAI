const { z } = require("zod");

const analyzeSubmissionSchema = z.object({
  code: z.string().min(1, "Code is required").max(50000, "Code too long"),
  language: z.string().min(1, "Language is required"),
  problemTitle: z.string().optional(),
});

const detectPatternSchema = z.object({
  code: z.string().min(1, "Code is required").max(50000, "Code too long"),
  language: z.string().min(1, "Language is required"),
});

const sendMessageSchema = z.object({
  conversationId: z.string().min(1, "Conversation ID is required"),
  content: z.string().min(1, "Message is required").max(10000, "Message too long"),
});

const createConversationSchema = z.object({
  title: z.string().min(1).max(100).optional(),
});

const generateRevisionPlanSchema = z.object({
  weakTopics: z.array(z.string()).min(1, "At least one topic required"),
  planType: z.enum(["7day", "30day", "60day"]),
});

const explainCodeSchema = z.object({
  code: z.string().min(1, "Code is required").max(50000, "Code too long"),
  language: z.string().min(1, "Language is required"),
  question: z.string().max(5000).optional(),
});

module.exports = {
  analyzeSubmissionSchema,
  detectPatternSchema,
  sendMessageSchema,
  createConversationSchema,
  generateRevisionPlanSchema,
  explainCodeSchema,
};
