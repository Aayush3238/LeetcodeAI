const realLeetcode = require("../services/leetcode/realLeetcode");
const prisma = require("../config/db");
const { createNotification } = require("./notificationController");

const getProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    const profile = await realLeetcode.getProfile(username);

    if (!profile) {
      return res.status(404).json({ message: "LeetCode user not found" });
    }

    res.json({ profile });
  } catch (error) {
    next(error);
  }
};

const getStatus = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { leetcodeUsername: true, lastSyncedAt: true },
    });

    res.json({
      connected: !!user.leetcodeUsername,
      username: user.leetcodeUsername,
      lastSyncedAt: user.lastSyncedAt,
    });
  } catch (error) {
    next(error);
  }
};

const connect = async (req, res, next) => {
  try {
    const { username } = req.body;

    if (!username || typeof username !== "string") {
      return res.status(400).json({ message: "LeetCode username is required" });
    }

    const trimmed = username.trim();
    if (trimmed.length < 1 || trimmed.length > 50) {
      return res.status(400).json({ message: "Invalid username length" });
    }

    const existing = await prisma.user.findFirst({
      where: { leetcodeUsername: trimmed, NOT: { id: req.user.id } },
    });
    if (existing) {
      return res.status(409).json({ message: "This LeetCode account is already linked to another user" });
    }

    const profile = await realLeetcode.getProfile(trimmed);
    if (!profile) {
      return res.status(404).json({ message: "LeetCode user not found. Check the username and try again." });
    }

    const result = await realLeetcode.syncToDatabase(req.user.id, trimmed);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { lastSyncedAt: new Date() },
    });

    res.json({
      message: "LeetCode account connected and synced",
      profile: result.profile,
      syncedCount: result.syncedCount,
    });
  } catch (error) {
    next(error);
  }
};

const sync = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { leetcodeUsername: true },
    });

    if (!user.leetcodeUsername) {
      return res.status(400).json({ message: "No LeetCode account connected. Connect one first." });
    }

    const result = await realLeetcode.syncToDatabase(req.user.id, user.leetcodeUsername);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { lastSyncedAt: new Date() },
    });

    await createNotification(
      req.user.id,
      "sync",
      "LeetCode Sync Complete",
      `Synced ${result.syncedCount} problems from LeetCode.`
    );

    res.json({
      message: "LeetCode data synced",
      profile: result.profile,
      syncedCount: result.syncedCount,
    });
  } catch (error) {
    next(error);
  }
};

const disconnect = async (req, res, next) => {
  try {
    await prisma.user.update({
      where: { id: req.user.id },
      data: { leetcodeUsername: null },
    });

    res.json({ message: "LeetCode account disconnected" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, getStatus, connect, sync, disconnect };
