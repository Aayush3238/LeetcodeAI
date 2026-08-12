const { z } = require("zod");

const connectLeetcodeSchema = z.object({
  username: z.string().min(1, "Username is required").max(50, "Username too long").trim(),
});

const saveSessionSchema = z.object({
  session: z.string().min(1, "Session cookie is required"),
});

module.exports = { connectLeetcodeSchema, saveSessionSchema };
