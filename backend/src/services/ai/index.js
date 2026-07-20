const OpenAI = require("openai");
const redis = require("../../config/redis");

let openai;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "your-openai-api-key") {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const SYSTEM_PROMPT = `You are LeetCoach AI, an expert competitive programming coach. You help users understand algorithms, data structures, and coding patterns. Be concise, educational, and encouraging.`;

const CACHE_TTL = 3600;

async function getCached(key) {
  try {
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

async function setCache(key, value) {
  try {
    await redis.set(key, JSON.stringify(value), "EX", CACHE_TTL);
  } catch {}
}

function mockAIResponse(type) {
  const responses = {
    analyze: {
      timeComplexity: "O(n) - Single pass through the array",
      spaceComplexity: "O(n) - Hash map stores up to n elements",
      optimizations: ["Consider edge cases where the array has duplicate elements", "Could use two pointers if array is sorted"],
      readability: "Code is clean and readable. Variable names are descriptive.",
      edgeCases: ["Empty array", "Single element array", "No valid solution exists", "Multiple valid pairs"],
      pattern: "Hash Map Lookup",
      difficulty: "Easy",
      overallScore: 85,
    },
    pattern: {
      detectedPatterns: [
        { name: "Hash Map", confidence: 95, description: "Using hash map for O(1) lookups" },
        { name: "Array Traversal", confidence: 90, description: "Single pass iteration" },
      ],
    },
    explain: {
      explanation: `This solution uses a hash map to find the complement of each element. For each number, we check if its complement (target - current) exists in the map. If yes, we found our pair. If not, we store the current number and its index. This gives us O(n) time complexity.`,
    },
  };
  return responses[type] || { message: "AI response generated" };
}

class AIService {
  async analyzeSubmission(code, language, problemTitle) {
    const cacheKey = `analyze:${language}:${code.slice(0, 100)}`;
    const cached = await getCached(cacheKey);
    if (cached) return cached;

    if (!openai) return mockAIResponse("analyze");

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Analyze this ${language} solution for "${problemTitle}":\n\n${code}\n\nProvide: Time Complexity, Space Complexity, Optimization Suggestions, Code Readability Review, Edge Cases, Pattern Used, Difficulty Level, Overall Score (0-100).`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });
      const result = JSON.parse(response.choices[0].message.content);
      await setCache(cacheKey, result);
      return result;
    } catch {
      return mockAIResponse("analyze");
    }
  }

  async detectPattern(code, language) {
    const cacheKey = `pattern:${language}:${code.slice(0, 100)}`;
    const cached = await getCached(cacheKey);
    if (cached) return cached;

    if (!openai) return mockAIResponse("pattern");

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Detect the algorithmic patterns used in this ${language} code:\n\n${code}\n\nList each pattern with confidence score and brief description.`,
          },
        ],
        temperature: 0.5,
        max_tokens: 500,
      });
      const result = JSON.parse(response.choices[0].message.content);
      await setCache(cacheKey, result);
      return result;
    } catch {
      return mockAIResponse("pattern");
    }
  }

  async generateRevisionPlan(weakTopics, planType) {
    if (!openai) {
      const days = planType === "7day" ? 7 : planType === "30day" ? 30 : 60;
      return {
        type: planType,
        days: Array.from({ length: days }, (_, i) => ({
          day: i + 1,
          topic: weakTopics[i % weakTopics.length] || "General Practice",
          problems: ["Two Sum", "Valid Parentheses", "Maximum Subarray"],
          estimatedTime: 60,
        })),
      };
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Create a ${planType} revision plan for these weak topics: ${weakTopics.join(", ")}. Include daily topics, suggested problems, and estimated time.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });
      return JSON.parse(response.choices[0].message.content);
    } catch {
      return { type: planType, days: [] };
    }
  }

  async explainCode(code, language, question) {
    if (!openai) return mockAIResponse("explain");

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Explain this ${language} code:\n\n${code}\n\nUser question: ${question || "Provide a detailed explanation"}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });
      return { explanation: response.choices[0].message.content };
    } catch {
      return mockAIResponse("explain");
    }
  }

  async chat(messages) {
    if (!openai) {
      const lastMsg = messages[messages.length - 1]?.content || "";
      return `I understand your question about "${lastMsg.substring(0, 50)}...". Here's what I think: This is a great problem to practice. Let me break it down for you.`;
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        temperature: 0.7,
        max_tokens: 1500,
      });
      return response.choices[0].message.content;
    } catch {
      return "I'm having trouble connecting to the AI service. Please try again later.";
    }
  }

  async *chatStream(messages) {
    if (!openai) {
      yield "I'm currently running in demo mode. Please configure the OPENAI_API_KEY for full functionality.";
      return;
    }

    try {
      const stream = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        temperature: 0.7,
        max_tokens: 1500,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) yield content;
      }
    } catch {
      yield "Error connecting to AI service.";
    }
  }
}

module.exports = new AIService();
