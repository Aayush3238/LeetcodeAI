const leetcodeService = require("../services/leetcode");
const prisma = require("../config/db");

const getProblems = async (req, res, next) => {
  try {
    const { search, difficulty, topic, page = 1, limit = 20, sort = "title" } = req.query;
    let problems = await leetcodeService.getProblems();

    if (search) {
      problems = problems.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));
    }
    if (difficulty) {
      problems = problems.filter((p) => p.difficulty === difficulty);
    }
    if (topic) {
      problems = problems.filter((p) => p.topic === topic);
    }

    const total = problems.length;
    const offset = (page - 1) * limit;
    problems = problems.slice(offset, offset + Number(limit));

    res.json({ problems, total, page: Number(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

const getTopics = async (req, res, next) => {
  try {
    const problems = await leetcodeService.getProblems();
    const topics = [...new Set(problems.map((p) => p.topic))];
    res.json({ topics });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProblems, getTopics };
