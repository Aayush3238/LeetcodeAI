const prisma = require("../config/db");

const getBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: req.user.id },
      include: { problem: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ bookmarks });
  } catch (error) {
    next(error);
  }
};

const addBookmark = async (req, res, next) => {
  try {
    const { problemId, note } = req.body;
    if (!problemId) {
      return res.status(400).json({ message: "problemId is required" });
    }

    const problem = await prisma.problem.findUnique({ where: { id: problemId } });
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const existing = await prisma.bookmark.findUnique({
      where: { userId_problemId: { userId: req.user.id, problemId } },
    });
    if (existing) {
      return res.status(409).json({ message: "Already bookmarked" });
    }

    const bookmark = await prisma.bookmark.create({
      data: { userId: req.user.id, problemId, note: note || null },
      include: { problem: true },
    });

    res.status(201).json({ bookmark });
  } catch (error) {
    next(error);
  }
};

const removeBookmark = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.bookmark.deleteMany({
      where: { id, userId: req.user.id },
    });
    res.json({ message: "Bookmark removed" });
  } catch (error) {
    next(error);
  }
};

const toggleBookmark = async (req, res, next) => {
  try {
    const { problemId } = req.body;
    if (!problemId) {
      return res.status(400).json({ message: "problemId is required" });
    }

    const existing = await prisma.bookmark.findUnique({
      where: { userId_problemId: { userId: req.user.id, problemId } },
    });

    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } });
      return res.json({ bookmarked: false });
    }

    await prisma.bookmark.create({
      data: { userId: req.user.id, problemId },
    });
    res.json({ bookmarked: true });
  } catch (error) {
    next(error);
  }
};

module.exports = { getBookmarks, addBookmark, removeBookmark, toggleBookmark };
