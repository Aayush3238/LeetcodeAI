const leetcodeService = require("../services/leetcode");
const prisma = require("../config/db");

const getProblems = async (req, res, next) => {
  try {
    const { search, difficulty, topic, page = 1, limit = 20, sort = "leetcodeId" } = req.query;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const where = {};
    if (search) {
      where.title = { contains: search, mode: "insensitive" };
    }
    if (difficulty) {
      where.difficulty = difficulty;
    }
    if (topic) {
      where.topic = topic;
    }

    const orderBy = sort === "title" ? { title: "asc" } : { leetcodeId: "asc" };

    try {
      const [problems, total] = await Promise.all([
        prisma.problem.findMany({
          where,
          orderBy,
          skip,
          take: limitNum,
          select: {
            leetcodeId: true,
            title: true,
            titleSlug: true,
            difficulty: true,
            topic: true,
            tags: true,
            acceptance: true,
          },
        }),
        prisma.problem.count({ where }),
      ]);

      res.json({
        problems,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
      });
    } catch {
      const allProblems = await leetcodeService.getProblems();
      let filtered = allProblems;
      if (search) filtered = filtered.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));
      if (difficulty) filtered = filtered.filter((p) => p.difficulty === difficulty);
      if (topic) filtered = filtered.filter((p) => p.topic === topic);
      const total = filtered.length;
      const paginated = filtered.slice(skip, skip + limitNum);
      res.json({ problems: paginated, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
    }
  } catch (error) {
    next(error);
  }
};

const getTopics = async (req, res, next) => {
  try {
    let problems;
    try {
      const dbProblems = await prisma.problem.findMany({ select: { topic: true } });
      problems = dbProblems;
    } catch {
      problems = await leetcodeService.getProblems();
    }

    const topics = [...new Set(problems.map((p) => p.topic))];
    res.json({ topics });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProblems, getTopics };
