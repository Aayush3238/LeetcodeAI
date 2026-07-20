const leetcodeService = require("../services/leetcode");
const prisma = require("../config/db");

const getDashboard = async (req, res, next) => {
  try {
    const [stats, topicDistribution, dailyActivity, recentProblems] = await Promise.all([
      leetcodeService.getUserStats(),
      leetcodeService.getTopicDistribution(),
      leetcodeService.getDailyActivity(),
      leetcodeService.getProblems().then((p) => p.slice(0, 5)),
    ]);

    res.json({
      user: req.user,
      stats,
      topicDistribution,
      dailyActivity,
      recentProblems,
    });
  } catch (error) {
    next(error);
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    const topicDistribution = await leetcodeService.getTopicDistribution();
    const stats = await leetcodeService.getUserStats();

    const weeklyProgress = [
      { week: "Week 1", solved: 12 },
      { week: "Week 2", solved: 18 },
      { week: "Week 3", solved: 15 },
      { week: "Week 4", solved: 22 },
    ];

    const monthlyProgress = [
      { month: "Jan", solved: 45 },
      { month: "Feb", solved: 52 },
      { month: "Mar", solved: 38 },
      { month: "Apr", solved: 61 },
      { month: "May", solved: 48 },
      { month: "Jun", solved: 55 },
      { month: "Jul", solved: 42 },
    ];

    const submissionFrequency = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      count: Math.floor(Math.random() * 10),
    }));

    res.json({
      topicDistribution,
      difficultyDistribution: { easy: stats.easy, medium: stats.medium, hard: stats.hard },
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
    const topicDistribution = await leetcodeService.getTopicDistribution();
    const maxCount = Math.max(...topicDistribution.map((t) => t.count));

    const topics = topicDistribution.map((t) => ({
      topic: t.topic,
      strengthScore: Math.round((t.count / maxCount) * 100),
      problemCount: t.count,
    }));

    topics.sort((a, b) => a.strengthScore - b.strengthScore);

    const weakTopics = topics.slice(0, 5);
    const strongTopics = topics.slice(-5).reverse();

    const overallStrength = Math.round(topics.reduce((acc, t) => acc + t.strengthScore, 0) / topics.length);

    res.json({ weakTopics, strongTopics, overallStrength, topics });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard, getAnalytics, getWeakTopics };
