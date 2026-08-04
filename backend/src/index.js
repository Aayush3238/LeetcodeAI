require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");
const { apiLimiter } = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./utils/logger");

const authRoutes = require("./routes/auth");
const problemRoutes = require("./routes/problems");
const submissionRoutes = require("./routes/submissions");
const aiRoutes = require("./routes/ai");
const dashboardRoutes = require("./routes/dashboard");
const leetcodeRoutes = require("./routes/leetcode");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173", credentials: true }));
app.use(morgan("combined", { stream: { write: (msg) => logger.info(msg.trim()) } }));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(require("express-session")({
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || "dev-session-secret",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use("/api", apiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/leetcode", leetcodeRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`LeetCoach AI server running on port ${PORT}`);
});

module.exports = app;
