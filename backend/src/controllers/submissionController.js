const prisma = require("../config/db");
const aiService = require("../services/ai");

const getSubmissions = async (req, res, next) => {
  try {
    const userId = req.user.id;

    let submissions;
    try {
      submissions = await prisma.submission.findMany({
        where: { userId },
        include: { problem: true },
        orderBy: { submissionTime: "desc" },
        take: 50,
      });
    } catch {
      submissions = [];
    }

    res.json({ submissions });
  } catch (error) {
    next(error);
  }
};

const analyzeSubmission = async (req, res, next) => {
  try {
    const { code, language, problemTitle } = req.body;
    const analysis = await aiService.analyzeSubmission(code, language, problemTitle);
    res.json({ analysis });
  } catch (error) {
    next(error);
  }
};

const detectPattern = async (req, res, next) => {
  try {
    const { code, language } = req.body;
    const patterns = await aiService.detectPattern(code, language);
    res.json({ patterns });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSubmissions, analyzeSubmission, detectPattern };
