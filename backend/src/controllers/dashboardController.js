const prisma = require("../config/db");

const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [problemsSolved, submissions, recentProblems] = await Promise.all([
      prisma.userProblem.findMany({
        where: { userId },
        include: { problem: true },
      }),
      prisma.submission.findMany({
        where: { userId },
        include: { problem: true },
        orderBy: { submissionTime: "desc" },
      }),
      prisma.userProblem.findMany({
        where: { userId },
        include: { problem: true },
        orderBy: { solvedAt: "desc" },
        take: 5,
      }),
    ]);

    const easy = problemsSolved.filter((p) => p.problem.difficulty === "Easy").length;
    const medium = problemsSolved.filter((p) => p.problem.difficulty === "Medium").length;
    const hard = problemsSolved.filter((p) => p.problem.difficulty === "Hard").length;

    const topicMap = {};
    problemsSolved.forEach(({ problem }) => {
      const topic = problem.topic || "Unknown";
      topicMap[topic] = (topicMap[topic] || 0) + 1;
    });
    const topicDistribution = Object.entries(topicMap)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count);

    const dayMs = 24 * 60 * 60 * 1000;
    const now = new Date();
    const dailyActivity = [];
    for (let i = 365; i >= 0; i--) {
      const date = new Date(now.getTime() - i * dayMs);
      const dayStr = date.toISOString().split("T")[0];
      const count = submissions.filter((s) => {
        const sDate = new Date(s.submissionTime).toISOString().split("T")[0];
        return sDate === dayStr;
      }).length;
      dailyActivity.push({ date: dayStr, count });
    }

    res.json({
      user: req.user,
      stats: {
        totalSolved: problemsSolved.length,
        easy,
        medium,
        hard,
        totalSubmissions: submissions.length,
        acceptanceRate: submissions.length > 0 ? Math.round((problemsSolved.length / submissions.length) * 100) : 0,
      },
      topicDistribution,
      dailyActivity,
      recentProblems: recentProblems.map((rp) => rp.problem),
    });
  } catch (error) {
    next(error);
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [problemsSolved, submissions] = await Promise.all([
      prisma.userProblem.findMany({
        where: { userId },
        include: { problem: true },
      }),
      prisma.submission.findMany({
        where: { userId },
        include: { problem: true },
        orderBy: { submissionTime: "asc" },
      }),
    ]);

    const topicMap = {};
    problemsSolved.forEach(({ problem }) => {
      const topic = problem.topic || "Unknown";
      topicMap[topic] = (topicMap[topic] || 0) + 1;
    });
    const topicDistribution = Object.entries(topicMap)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count);

    const easy = problemsSolved.filter((p) => p.problem.difficulty === "Easy").length;
    const medium = problemsSolved.filter((p) => p.problem.difficulty === "Medium").length;
    const hard = problemsSolved.filter((p) => p.problem.difficulty === "Hard").length;

    const weekMs = 7 * 24 * 60 * 60 * 1000;
    const now = new Date();
    const weeklyProgress = [];
    for (let w = 3; w >= 0; w--) {
      const weekStart = new Date(now.getTime() - (w + 1) * weekMs);
      const weekEnd = new Date(now.getTime() - w * weekMs);
      const count = submissions.filter((s) => {
        const t = new Date(s.submissionTime);
        return t >= weekStart && t < weekEnd;
      }).length;
      weeklyProgress.push({ week: `Week ${4 - w}`, solved: count });
    }

    const monthlyProgress = [];
    for (let m = 6; m >= 0; m--) {
      const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      const count = submissions.filter((s) => {
        const t = new Date(s.submissionTime);
        return t >= d && t <= monthEnd;
      }).length;
      monthlyProgress.push({ month: d.toLocaleString("default", { month: "short" }), solved: count });
    }

    const hourCounts = Array.from({ length: 24 }, () => 0);
    submissions.forEach((s) => {
      const hour = new Date(s.submissionTime).getHours();
      hourCounts[hour]++;
    });
    const submissionFrequency = hourCounts.map((count, i) => ({ hour: `${i}:00`, count }));

    res.json({
      topicDistribution,
      difficultyDistribution: { easy, medium, hard },
      weeklyProgress,
      monthlyProgress,
      submissionFrequency,
    });
  } catch (error) {
    next(error);
  }
};

const getWeakTopics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const problemsSolved = await prisma.userProblem.findMany({
      where: { userId },
      include: { problem: true },
    });

    const topicMap = {};
    problemsSolved.forEach(({ problem }) => {
      const topic = problem.topic || "Unknown";
      topicMap[topic] = (topicMap[topic] || 0) + 1;
    });

    const maxCount = Math.max(...Object.values(topicMap), 1);

    const topics = Object.entries(topicMap)
      .map(([topic, count]) => ({
        topic,
        strengthScore: Math.round((count / maxCount) * 100),
        problemCount: count,
      }))
      .sort((a, b) => a.strengthScore - b.strengthScore);

    const weakTopics = topics.slice(0, 5);
    const strongTopics = topics.slice(-5).reverse();
    const overallStrength = topics.length > 0
      ? Math.round(topics.reduce((acc, t) => acc + t.strengthScore, 0) / topics.length)
      : 0;

    res.json({ weakTopics, strongTopics, overallStrength, topics });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard, getAnalytics, getWeakTopics };
