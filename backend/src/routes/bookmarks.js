const express = require("express");
const { getBookmarks, addBookmark, removeBookmark, toggleBookmark } = require("../controllers/bookmarkController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.get("/", authenticate, getBookmarks);
router.post("/", authenticate, addBookmark);
router.post("/toggle", authenticate, toggleBookmark);
router.delete("/:id", authenticate, removeBookmark);

module.exports = router;
