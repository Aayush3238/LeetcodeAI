const { z } = require("zod");

const addBookmarkSchema = z.object({
  problemId: z.string().min(1, "Problem ID is required"),
  note: z.string().max(500, "Note too long").optional(),
});

const toggleBookmarkSchema = z.object({
  problemId: z.string().min(1, "Problem ID is required"),
});

module.exports = { addBookmarkSchema, toggleBookmarkSchema };
