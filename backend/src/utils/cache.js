let redis;
try {
  redis = require("../config/redis");
} catch {
  redis = null;
}

async function invalidateCache(pattern) {
  if (!redis) return;
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error("[Cache Invalidation Error]", error.message);
  }
}

async function invalidateUserCache(userId) {
  await invalidateCache(`user:${userId}:*`);
  await invalidateCache(`submissions:${userId}:*`);
  await invalidateCache(`dashboard:${userId}:*`);
}

async function invalidateProblemCache() {
  await invalidateCache(`problems:*`);
  await invalidateCache(`topics:*`);
}

module.exports = { invalidateCache, invalidateUserCache, invalidateProblemCache };
