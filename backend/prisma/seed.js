const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const problems = [
  { leetcodeId: 1, title: "Two Sum", titleSlug: "two-sum", difficulty: "Easy", topic: "Array", tags: ["Array", "Hash Table"], acceptance: 49.2 },
  { leetcodeId: 2, title: "Add Two Numbers", titleSlug: "add-two-numbers", difficulty: "Medium", topic: "Linked List", tags: ["Linked List", "Math"], acceptance: 41.8 },
  { leetcodeId: 3, title: "Longest Substring Without Repeating Characters", titleSlug: "longest-substring-without-repeating-characters", difficulty: "Medium", topic: "Sliding Window", tags: ["String", "Sliding Window"], acceptance: 34.5 },
  { leetcodeId: 4, title: "Median of Two Sorted Arrays", titleSlug: "median-of-two-sorted-arrays", difficulty: "Hard", topic: "Binary Search", tags: ["Array", "Binary Search"], acceptance: 35.8 },
  { leetcodeId: 5, title: "Longest Palindromic Substring", titleSlug: "longest-palindromic-substring", difficulty: "Medium", topic: "Dynamic Programming", tags: ["String", "DP"], acceptance: 33.1 },
  { leetcodeId: 15, title: "3Sum", titleSlug: "3sum", difficulty: "Medium", topic: "Two Pointers", tags: ["Array", "Two Pointers"], acceptance: 32.7 },
  { leetcodeId: 20, title: "Valid Parentheses", titleSlug: "valid-parentheses", difficulty: "Easy", topic: "Stack", tags: ["Stack", "String"], acceptance: 40.2 },
  { leetcodeId: 21, title: "Merge Two Sorted Lists", titleSlug: "merge-two-sorted-lists", difficulty: "Easy", topic: "Linked List", tags: ["Linked List", "Recursion"], acceptance: 63.5 },
  { leetcodeId: 53, title: "Maximum Subarray", titleSlug: "maximum-subarray", difficulty: "Medium", topic: "Dynamic Programming", tags: ["Array", "DP"], acceptance: 50.1 },
  { leetcodeId: 70, title: "Climbing Stairs", titleSlug: "climbing-stairs", difficulty: "Easy", topic: "Dynamic Programming", tags: ["Math", "DP"], acceptance: 51.7 },
  { leetcodeId: 78, title: "Subsets", titleSlug: "subsets", difficulty: "Medium", topic: "Backtracking", tags: ["Array", "Backtracking"], acceptance: 73.4 },
  { leetcodeId: 98, title: "Validate Binary Search Tree", titleSlug: "validate-binary-search-tree", difficulty: "Medium", topic: "Tree", tags: ["Tree", "BST"], acceptance: 32.4 },
  { leetcodeId: 100, title: "Same Tree", titleSlug: "same-tree", difficulty: "Easy", topic: "Tree", tags: ["Tree", "DFS"], acceptance: 58.3 },
  { leetcodeId: 104, title: "Maximum Depth of Binary Tree", titleSlug: "maximum-depth-of-binary-tree", difficulty: "Easy", topic: "Tree", tags: ["Tree", "DFS"], acceptance: 74.2 },
  { leetcodeId: 121, title: "Best Time to Buy and Sell Stock", titleSlug: "best-time-to-buy-and-sell-stock", difficulty: "Easy", topic: "Dynamic Programming", tags: ["Array", "DP"], acceptance: 54.2 },
  { leetcodeId: 133, title: "Clone Graph", titleSlug: "clone-graph", difficulty: "Medium", topic: "Graph", tags: ["Graph", "DFS", "BFS"], acceptance: 55.7 },
  { leetcodeId: 200, title: "Number of Islands", titleSlug: "number-of-islands", difficulty: "Medium", topic: "Graph", tags: ["Graph", "DFS", "BFS"], acceptance: 57.6 },
  { leetcodeId: 207, title: "Course Schedule", titleSlug: "course-schedule", difficulty: "Medium", topic: "Graph", tags: ["Graph", "Topological Sort"], acceptance: 45.3 },
  { leetcodeId: 300, title: "Longest Increasing Subsequence", titleSlug: "longest-increasing-subsequence", difficulty: "Medium", topic: "Dynamic Programming", tags: ["Array", "DP", "Binary Search"], acceptance: 52.6 },
  { leetcodeId: 322, title: "Coin Change", titleSlug: "coin-change", difficulty: "Medium", topic: "Dynamic Programming", tags: ["Array", "DP"], acceptance: 42.3 },
];

async function main() {
  console.log("Seeding database...");

  const hashedPassword = await bcrypt.hash("password123", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@leetcoach.ai" },
    update: {},
    create: {
      email: "demo@leetcoach.ai",
      name: "Demo User",
      password: hashedPassword,
      leetcodeUsername: "demo_user",
    },
  });

  console.log(`Created user: ${user.email}`);

  for (const p of problems) {
    await prisma.problem.upsert({
      where: { leetcodeId: p.leetcodeId },
      update: {},
      create: p,
    });
  }

  console.log(`Created ${problems.length} problems`);

  const createdProblems = await prisma.problem.findMany();

  const submissions = [
    { problemId: createdProblems[0].id, code: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n}', language: "javascript", runtime: 68, memory: 42.1, status: "Accepted", submissionTime: new Date("2026-07-15") },
    { problemId: createdProblems[6].id, code: 'function isValid(s) {\n  const stack = [];\n  const map = { \')\': \'(\', \']\': \'[\', \'}\': \'{\' };\n  for (const char of s) {\n    if (char in map) {\n      if (stack.pop() !== map[char]) return false;\n    } else stack.push(char);\n  }\n  return stack.length === 0;\n}', language: "javascript", runtime: 52, memory: 41.3, status: "Accepted", submissionTime: new Date("2026-07-16") },
    { problemId: createdProblems[8].id, code: 'function maxSubArray(nums) {\n  let max = nums[0], curr = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    curr = Math.max(nums[i], curr + nums[i]);\n    max = Math.max(max, curr);\n  }\n  return max;\n}', language: "javascript", runtime: 72, memory: 43.5, status: "Accepted", submissionTime: new Date("2026-07-17") },
  ];

  for (const s of submissions) {
    await prisma.submission.create({ data: { ...s, userId: user.id } });
  }

  console.log(`Created ${submissions.length} submissions`);

  const solvedProblems = createdProblems.slice(0, 8);
  for (const p of solvedProblems) {
    await prisma.userProblem.upsert({
      where: { userId_problemId: { userId: user.id, problemId: p.id } },
      update: {},
      create: { userId: user.id, problemId: p.id },
    });
  }

  console.log(`Marked ${solvedProblems.length} problems as solved`);
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
