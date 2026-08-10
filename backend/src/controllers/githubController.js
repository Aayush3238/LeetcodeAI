const githubService = require("../services/github");
const prisma = require("../config/db");
const { logAudit } = require("../utils/audit");

const getStatus = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { githubId: true },
    });

    res.json({
      connected: !!user.githubId,
    });
  } catch (error) {
    next(error);
  }
};

const getRepos = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { githubToken: true },
    });

    if (!user.githubToken) {
      return res.status(400).json({ message: "GitHub not connected" });
    }

    const repos = await githubService.getRepos(user.githubToken);
    res.json({ repos });
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { githubToken: true },
    });

    if (!user.githubToken) {
      return res.status(400).json({ message: "GitHub not connected" });
    }

    const stats = await githubService.getContributionStats(user.githubToken);
    res.json({ stats });
  } catch (error) {
    next(error);
  }
};

const getRepoStats = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { githubToken: true },
    });

    if (!user.githubToken) {
      return res.status(400).json({ message: "GitHub not connected" });
    }

    const stats = await githubService.getRepoStats(user.githubToken, owner, repo);
    res.json({ stats });
  } catch (error) {
    next(error);
  }
};

const disconnect = async (req, res, next) => {
  try {
    await prisma.user.update({
      where: { id: req.user.id },
      data: { githubId: null, githubToken: null },
    });

    await logAudit(req.user.id, "GITHUB_DISCONNECTED", "GitHub account disconnected", req.ip);

    res.json({ message: "GitHub account disconnected" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStatus, getRepos, getStats, getRepoStats, disconnect };
