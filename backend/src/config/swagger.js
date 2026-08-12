const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LeetCoach AI API",
      version: "1.0.0",
      description: "AI-powered LeetCode preparation platform API",
      contact: { name: "LeetCoach Team" },
    },
    servers: [
      { url: "http://localhost:5000", description: "Development" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        csrfToken: {
          type: "apiKey",
          in: "header",
          name: "X-CSRF-Token",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            email: { type: "string", format: "email" },
            name: { type: "string" },
            avatar: { type: "string", nullable: true },
            leetcodeUsername: { type: "string", nullable: true },
            googleId: { type: "string", nullable: true },
            githubId: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Problem: {
          type: "object",
          properties: {
            id: { type: "string" },
            leetcodeId: { type: "integer" },
            title: { type: "string" },
            titleSlug: { type: "string" },
            difficulty: { type: "string", enum: ["Easy", "Medium", "Hard"] },
            topic: { type: "string" },
            tags: { type: "array", items: { type: "string" } },
            acceptance: { type: "number" },
          },
        },
        Submission: {
          type: "object",
          properties: {
            id: { type: "string" },
            problemId: { type: "string" },
            code: { type: "string" },
            language: { type: "string" },
            runtime: { type: "number", nullable: true },
            memory: { type: "number", nullable: true },
            status: { type: "string" },
            submissionTime: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: { type: "string" },
            code: { type: "string" },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
