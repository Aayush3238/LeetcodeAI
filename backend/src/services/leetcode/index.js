const mockProblems = [
  { leetcodeId: 1, title: "Two Sum", titleSlug: "two-sum", difficulty: "Easy", topic: "Array", tags: ["Array", "Hash Table"], acceptance: 49.2 },
  { leetcodeId: 2, title: "Add Two Numbers", titleSlug: "add-two-numbers", difficulty: "Medium", topic: "Linked List", tags: ["Linked List", "Math"], acceptance: 41.8 },
  { leetcodeId: 3, title: "Longest Substring Without Repeating Characters", titleSlug: "longest-substring-without-repeating-characters", difficulty: "Medium", topic: "Sliding Window", tags: ["String", "Sliding Window"], acceptance: 34.5 },
  { leetcodeId: 4, title: "Median of Two Sorted Arrays", titleSlug: "median-of-two-sorted-arrays", difficulty: "Hard", topic: "Binary Search", tags: ["Array", "Binary Search"], acceptance: 35.8 },
  { leetcodeId: 5, title: "Longest Palindromic Substring", titleSlug: "longest-palindromic-substring", difficulty: "Medium", topic: "Dynamic Programming", tags: ["String", "DP"], acceptance: 33.1 },
  { leetcodeId: 10, title: "Regular Expression Matching", titleSlug: "regular-expression-matching", difficulty: "Hard", topic: "Dynamic Programming", tags: ["String", "DP"], acceptance: 28.5 },
  { leetcodeId: 15, title: "3Sum", titleSlug: "3sum", difficulty: "Medium", topic: "Two Pointers", tags: ["Array", "Two Pointers"], acceptance: 32.7 },
  { leetcodeId: 20, title: "Valid Parentheses", titleSlug: "valid-parentheses", difficulty: "Easy", topic: "Stack", tags: ["Stack", "String"], acceptance: 40.2 },
  { leetcodeId: 21, title: "Merge Two Sorted Lists", titleSlug: "merge-two-sorted-lists", difficulty: "Easy", topic: "Linked List", tags: ["Linked List", "Recursion"], acceptance: 63.5 },
  { leetcodeId: 23, title: "Merge k Sorted Lists", titleSlug: "merge-k-sorted-lists", difficulty: "Hard", topic: "Heap", tags: ["Linked List", "Heap"], acceptance: 51.2 },
  { leetcodeId: 33, title: "Search in Rotated Sorted Array", titleSlug: "search-in-rotated-sorted-array", difficulty: "Medium", topic: "Binary Search", tags: ["Array", "Binary Search"], acceptance: 38.9 },
  { leetcodeId: 42, title: "Trapping Rain Water", titleSlug: "trapping-rain-water", difficulty: "Hard", topic: "Stack", tags: ["Array", "Stack", "Two Pointers"], acceptance: 59.1 },
  { leetcodeId: 46, title: "Permutations", titleSlug: "permutations", difficulty: "Medium", topic: "Backtracking", tags: ["Array", "Backtracking"], acceptance: 74.5 },
  { leetcodeId: 49, title: "Group Anagrams", titleSlug: "group-anagrams", difficulty: "Medium", topic: "Hashing", tags: ["String", "Hash Table"], acceptance: 67.8 },
  { leetcodeId: 53, title: "Maximum Subarray", titleSlug: "maximum-subarray", difficulty: "Medium", topic: "Dynamic Programming", tags: ["Array", "DP"], acceptance: 50.1 },
  { leetcodeId: 70, title: "Climbing Stairs", titleSlug: "climbing-stairs", difficulty: "Easy", topic: "Dynamic Programming", tags: ["Math", "DP"], acceptance: 51.7 },
  { leetcodeId: 76, title: "Minimum Window Substring", titleSlug: "minimum-window-substring", difficulty: "Hard", topic: "Sliding Window", tags: ["String", "Sliding Window"], acceptance: 41.5 },
  { leetcodeId: 78, title: "Subsets", titleSlug: "subsets", difficulty: "Medium", topic: "Backtracking", tags: ["Array", "Backtracking"], acceptance: 73.4 },
  { leetcodeId: 98, title: "Validate Binary Search Tree", titleSlug: "validate-binary-search-tree", difficulty: "Medium", topic: "Tree", tags: ["Tree", "BST"], acceptance: 32.4 },
  { leetcodeId: 100, title: "Same Tree", titleSlug: "same-tree", difficulty: "Easy", topic: "Tree", tags: ["Tree", "DFS"], acceptance: 58.3 },
  { leetcodeId: 104, title: "Maximum Depth of Binary Tree", titleSlug: "maximum-depth-of-binary-tree", difficulty: "Easy", topic: "Tree", tags: ["Tree", "DFS"], acceptance: 74.2 },
  { leetcodeId: 121, title: "Best Time to Buy and Sell Stock", titleSlug: "best-time-to-buy-and-sell-stock", difficulty: "Easy", topic: "Dynamic Programming", tags: ["Array", "DP"], acceptance: 54.2 },
  { leetcodeId: 133, title: "Clone Graph", titleSlug: "clone-graph", difficulty: "Medium", topic: "Graph", tags: ["Graph", "DFS", "BFS"], acceptance: 55.7 },
  { leetcodeId: 146, title: "LRU Cache", titleSlug: "lru-cache", difficulty: "Medium", topic: "Hashing", tags: ["Hash Table", "Linked List"], acceptance: 40.8 },
  { leetcodeId: 200, title: "Number of Islands", titleSlug: "number-of-islands", difficulty: "Medium", topic: "Graph", tags: ["Graph", "DFS", "BFS"], acceptance: 57.6 },
  { leetcodeId: 207, title: "Course Schedule", titleSlug: "course-schedule", difficulty: "Medium", topic: "Graph", tags: ["Graph", "Topological Sort"], acceptance: 45.3 },
  { leetcodeId: 208, title: "Implement Trie", titleSlug: "implement-trie-prefix-tree", difficulty: "Medium", topic: "Trie", tags: ["Trie", "String"], acceptance: 65.9 },
  { leetcodeId: 236, title: "Lowest Common Ancestor of a Binary Tree", titleSlug: "lowest-common-ancestor-of-a-binary-tree", difficulty: "Medium", topic: "Tree", tags: ["Tree", "DFS"], acceptance: 60.2 },
  { leetcodeId: 300, title: "Longest Increasing Subsequence", titleSlug: "longest-increasing-subsequence", difficulty: "Medium", topic: "Dynamic Programming", tags: ["Array", "DP", "Binary Search"], acceptance: 52.6 },
  { leetcodeId: 322, title: "Coin Change", titleSlug: "coin-change", difficulty: "Medium", topic: "Dynamic Programming", tags: ["Array", "DP"], acceptance: 42.3 },
  { leetcodeId: 416, title: "Partition Equal Subset Sum", titleSlug: "partition-equal-subset-sum", difficulty: "Medium", topic: "Dynamic Programming", tags: ["Array", "DP"], acceptance: 47.1 },
  { leetcodeId: 739, title: "Daily Temperatures", titleSlug: "daily-temperatures", difficulty: "Medium", topic: "Stack", tags: ["Stack", "Array"], acceptance: 65.8 },
];

const mockSubmissions = [
  { problemId: 1, code: "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n}", language: "javascript", runtime: 68, memory: 42.1, status: "Accepted", submissionTime: new Date("2026-07-15") },
  { problemId: 20, code: "function isValid(s) {\n  const stack = [];\n  const map = { ')': '(', ']': '[', '}': '{' };\n  for (const char of s) {\n    if (char in map) {\n      if (stack.pop() !== map[char]) return false;\n    } else stack.push(char);\n  }\n  return stack.length === 0;\n}", language: "javascript", runtime: 52, memory: 41.3, status: "Accepted", submissionTime: new Date("2026-07-16") },
  { problemId: 53, code: "function maxSubArray(nums) {\n  let max = nums[0], curr = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    curr = Math.max(nums[i], curr + nums[i]);\n    max = Math.max(max, curr);\n  }\n  return max;\n}", language: "javascript", runtime: 72, memory: 43.5, status: "Accepted", submissionTime: new Date("2026-07-17") },
  { problemId: 70, code: "function climbStairs(n) {\n  if (n <= 2) return n;\n  let a = 1, b = 2;\n  for (let i = 3; i <= n; i++) {\n    [a, b] = [b, a + b];\n  }\n  return b;\n}", language: "javascript", runtime: 48, memory: 40.9, status: "Accepted", submissionTime: new Date("2026-07-18") },
  { problemId: 104, code: "function maxDepth(root) {\n  if (!root) return 0;\n  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}", language: "javascript", runtime: 56, memory: 41.7, status: "Accepted", submissionTime: new Date("2026-07-19") },
  { problemId: 200, code: "function numIslands(grid) {\n  let count = 0;\n  const dfs = (i, j) => {\n    if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length || grid[i][j] === '0') return;\n    grid[i][j] = '0';\n    dfs(i+1,j); dfs(i-1,j); dfs(i,j+1); dfs(i,j-1);\n  };\n  for (let i = 0; i < grid.length; i++) {\n    for (let j = 0; j < grid[0].length; j++) {\n      if (grid[i][j] === '1') { count++; dfs(i,j); }\n    }\n  }\n  return count;\n}", language: "javascript", runtime: 88, memory: 45.2, status: "Accepted", submissionTime: new Date("2026-07-20") },
];

class LeetCodeService {
  async getProblems() {
    return mockProblems;
  }

  async getProblemBySlug(slug) {
    return mockProblems.find((p) => p.titleSlug === slug) || null;
  }

  async getSubmissions(userId) {
    return mockSubmissions.map((s, i) => ({
      id: `mock-sub-${i}`,
      ...s,
      problem: mockProblems.find((p) => p.leetcodeId === s.problemId),
    }));
  }

  async getUserStats() {
    return {
      totalSolved: 187,
      easy: 92,
      medium: 78,
      hard: 17,
      acceptanceRate: 68.5,
      contestRating: 1650,
      streak: 12,
      ranking: 45230,
    };
  }

  async getTopicDistribution() {
    return [
      { topic: "Array", count: 42 },
      { topic: "Hash Table", count: 28 },
      { topic: "Dynamic Programming", count: 24 },
      { topic: "Tree", count: 22 },
      { topic: "Graph", count: 18 },
      { topic: "Binary Search", count: 15 },
      { topic: "Stack", count: 14 },
      { topic: "Sliding Window", count: 10 },
      { topic: "Backtracking", count: 8 },
      { topic: "Linked List", count: 6 },
    ];
  }

  async getDailyActivity() {
    const activity = [];
    const now = new Date();
    for (let i = 365; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      activity.push({
        date: date.toISOString().split("T")[0],
        count: Math.floor(Math.random() * 5),
      });
    }
    return activity;
  }
}

module.exports = new LeetCodeService();
