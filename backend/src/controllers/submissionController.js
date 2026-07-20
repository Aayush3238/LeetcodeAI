const leetcodeService = require("../services/leetcode");
const aiService = require("../services/ai");
const prisma = require("../config/db");

const getSubmissions = async (req, res, next) => {
  try {
    const submissions = await leetcodeService.getSubmissions(req.user.id);
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
