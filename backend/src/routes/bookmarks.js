const express = require("express");
const { getBookmarks, addBookmark, removeBookmark, toggleBookmark } = require("../controllers/bookmarkController");
const { authenticate } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { addBookmarkSchema, toggleBookmarkSchema } = require("../validators/bookmark");

const router = express.Router();

router.get("/", authenticate, getBookmarks);
router.post("/", authenticate, validate(addBookmarkSchema), addBookmark);
router.post("/toggle", authenticate, validate(toggleBookmarkSchema), toggleBookmark);
router.delete("/:id", authenticate, removeBookmark);

module.exports = router;
