const TAG_TO_TOPIC = {
  Array: "Array",
  "Hash Table": "Hash Table",
  "Dynamic Programming": "Dynamic Programming",
  Math: "Math",
  String: "String",
  "Two Pointers": "Two Pointers",
  "Binary Search": "Binary Search",
  Greedy: "Greedy",
  "Bit Manipulation": "Bit Manipulation",
  Tree: "Tree",
  "Depth-First Search": "Tree",
  "Breadth-First Search": "Graph",
  Graph: "Graph",
  Stack: "Stack",
  Heap: "Heap",
  "Linked List": "Linked List",
  Recursion: "Recursion",
  Backtracking: "Backtracking",
  Sorting: "Sorting",
  "Sliding Window": "Sliding Window",
  Trie: "Trie",
  "Union Find": "Union Find",
  "Topological Sort": "Graph",
  Divide: "Divide and Conquer",
  Conquer: "Divide and Conquer",
  "Divide and Conquer": "Divide and Conquer",
  Matrix: "Matrix",
  "Counting": "Counting",
  Simulation: "Simulation",
  "Prefix Sum": "Prefix Sum",
  "Queue": "Queue",
  "Monotonic Stack": "Stack",
  "Binary Tree": "Tree",
  BST: "Tree",
  "Merge Sort": "Sorting",
  "Bucket Sort": "Sorting",
  "Radix Sort": "Sorting",
  "Counting Sort": "Sorting",
  "Design": "Design",
  "Iterator": "Design",
  "Game Theory": "Game Theory",
  "Probability": "Probability and Statistics",
  "Statistics": "Probability and Statistics",
  "Data Stream": "Design",
  "Segment Tree": "Advanced Data Structure",
  "Binary Indexed Tree": "Advanced Data Structure",
  "Suffix Array": "Advanced Data Structure",
};

function mapTagToTopic(tags) {
  if (!tags || tags.length === 0) return "Unknown";

  for (const tag of tags) {
    if (TAG_TO_TOPIC[tag]) return TAG_TO_TOPIC[tag];
  }

  for (const tag of tags) {
    const lower = tag.toLowerCase();
    for (const [key, topic] of Object.entries(TAG_TO_TOPIC)) {
      if (lower.includes(key.toLowerCase())) return topic;
    }
  }

  return tags[0] || "Unknown";
}

module.exports = { mapTagToTopic, TAG_TO_TOPIC };
