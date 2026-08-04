const prisma = require("../config/db");
let redis;
try {
  redis = require("../config/redis");
} catch {
  redis = null;
}

const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";
const CACHE_TTL = 600;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

const HEADERS = {
  "Content-Type": "application/json",
  "Referer": "https://leetcode.com",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
};

async function getCached(key) {
  if (!redis) return null;
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

async function setCache(key, data, ttl = CACHE_TTL) {
  if (!redis) return;
  try {
    await redis.setex(key, ttl, JSON.stringify(data));
  } catch {}
}

async function graphqlQuery(query, variables = {}) {
  let lastError;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(LEETCODE_GRAPHQL_URL, {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify({ query, variables }),
      });

      if (res.status === 429) {
        const delay = RETRY_DELAY_MS * attempt * 2;
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      if (!res.ok) {
        throw new Error(`LeetCode API error: ${res.status}`);
      }

      const json = await res.json();
      if (json.errors) {
        throw new Error(json.errors[0]?.message || "LeetCode GraphQL error");
      }
      return json.data;
    } catch (error) {
      lastError = error;
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * attempt));
      }
    }
  }
  throw lastError;
}

async function fetchUserProfile(username) {
  const cacheKey = `lc:profile:${username}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  const query = `
    query userPublicProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          realName
          userAvatar
          aboutMe
        }
        submitStats {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
        }
      }
    }
  `;

  const data = await graphqlQuery(query, { username });
  const result = data?.matchedUser;
  if (result) await setCache(cacheKey, result, 300);
  return result;
}

async function fetchUserSolvedProblems(username) {
  const cacheKey = `lc:solved:${username}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  const query = `
    query userSolvedProblems($username: String!) {
      allQuestionsCount {
        difficulty
        count
      }
      matchedUser(username: $username) {
        problemsSolvedBeatsStats {
          difficulty
          percentage
        }
        submitStats {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
        }
      }
    }
  `;

  const data = await graphqlQuery(query, { username });
  if (data) await setCache(cacheKey, data, 300);
  return data;
}

async function fetchRecentSubmissions(username, limit = 20) {
  const cacheKey = `lc:recent:${username}:${limit}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  const query = `
    query recentSubmissions($username: String!, $limit: Int!) {
      recentAcSubmissionList(username: $username, limit: $limit) {
        id
        title
        titleSlug
        timestamp
        lang
      }
    }
  `;

  const data = await graphqlQuery(query, { username, limit });
  const result = data?.recentAcSubmissionList || [];
  if (result.length > 0) await setCache(cacheKey, result, 120);
  return result;
}

async function fetchProblemDetails(titleSlug) {
  const cacheKey = `lc:problem:${titleSlug}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  const query = `
    query questionData($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        questionId
        title
        titleSlug
        difficulty
        topicTags {
          name
        }
        stats
        acRate
      }
    }
  `;

  const data = await graphqlQuery(query, { titleSlug });
  const result = data?.question;
  if (result) await setCache(cacheKey, result, 86400);
  return result;
}

class LeetCodeService {
  async getProfile(username) {
    const user = await fetchUserProfile(username);
    if (!user) return null;

    const stats = user.submitStats?.acSubmissionNum || [];
    const findCount = (diff) => stats.find((s) => s.difficulty === diff)?.count || 0;

    return {
      username: user.username,
      name: user.profile?.realName,
      avatar: user.profile?.userAvatar,
      about: user.profile?.aboutMe,
      totalSolved: findCount("All"),
      easy: findCount("Easy"),
      medium: findCount("Medium"),
      hard: findCount("Hard"),
    };
  }

  async getSolvedProblems(username) {
    const data = await fetchUserSolvedProblems(username);
    if (!data) return null;

    const stats = data.matchedUser?.submitStats?.acSubmissionNum || [];
    const findCount = (diff) => stats.find((s) => s.difficulty === diff)?.count || 0;
    const total = data.allQuestionsCount || [];

    return {
      totalQuestions: total.find((q) => q.difficulty === "All")?.count || 0,
      totalSolved: findCount("All"),
      easy: findCount("Easy"),
      medium: findCount("Medium"),
      hard: findCount("Hard"),
      beatsStats: data.matchedUser?.problemsSolvedBeatsStats || [],
    };
  }

  async getRecentSubmissions(username, limit = 20) {
    return fetchRecentSubmissions(username, limit);
  }

  async syncToDatabase(userId, username) {
    const profile = await this.getProfile(username);
    if (!profile) throw new Error("LeetCode user not found");

    const recentSubs = await this.getRecentSubmissions(username, 50);

    const syncedProblems = [];
    for (const sub of recentSubs) {
      let problem = await prisma.problem.findUnique({
        where: { titleSlug: sub.titleSlug },
      });

      if (!problem) {
        const details = await fetchProblemDetails(sub.titleSlug);
        const tags = details?.topicTags?.map((t) => t.name) || [];
        const primaryTag = tags[0] || "Unknown";

        problem = await prisma.problem.create({
          data: {
            leetcodeId: parseInt(details?.questionId || "0"),
            title: sub.title,
            titleSlug: sub.titleSlug,
            difficulty: details?.difficulty || "Medium",
            topic: primaryTag,
            tags,
            acceptance: details?.acRate || null,
          },
        });
      }

      const existingSub = await prisma.submission.findFirst({
        where: {
          userId,
          problemId: problem.id,
          code: `leetcode-sync-${sub.id}`,
        },
      });

      if (!existingSub) {
        await prisma.submission.create({
          data: {
            userId,
            problemId: problem.id,
            code: `leetcode-sync-${sub.id}`,
            language: sub.lang || "unknown",
            status: "Accepted",
            submissionTime: new Date(parseInt(sub.timestamp) * 1000),
          },
        });
      }

      const existingUP = await prisma.userProblem.findUnique({
        where: { userId_problemId: { userId, problemId: problem.id } },
      });

      if (!existingUP) {
        await prisma.userProblem.create({
          data: { userId, problemId: problem.id },
        });
      }

      syncedProblems.push(problem.titleSlug);
    }

    await prisma.user.update({
      where: { id: userId },
      data: { leetcodeUsername: username },
    });

    return {
      profile,
      syncedCount: syncedProblems.length,
      problems: syncedProblems,
    };
  }
}

module.exports = new LeetCodeService();
