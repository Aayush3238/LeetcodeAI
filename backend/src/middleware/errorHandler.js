const logger = require("../utils/logger");

const isProd = process.env.NODE_ENV === "production";

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack, path: req.path, method: req.method });

  if (err.name === "ZodError") {
    return res.status(400).json({
      message: "Validation error",
      errors: err.errors.map((e) => ({ field: e.path.join("."), message: e.message })),
    });
  }

  if (err.code === "P2002") {
    return res.status(409).json({ message: "Resource already exists" });
  }

  if (err.code === "P2025") {
    return res.status(404).json({ message: "Resource not found" });
  }

  if (err.name === "MulterError") {
    const messages = { LIMIT_FILE_SIZE: "File too large (max 2MB)", LIMIT_UNEXPECTED_FILE: "Unexpected file field" };
    return res.status(400).json({ message: messages[err.code] || "File upload error" });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Token expired", code: "TOKEN_EXPIRED" });
  }

  const statusCode = err.statusCode || 500;
  const message = isProd ? "Internal server error" : err.message;

  res.status(statusCode).json({ message });
};

module.exports = errorHandler;
