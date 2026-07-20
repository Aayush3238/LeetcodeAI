const logger = require("../utils/logger");

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

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === "production" ? "Internal server error" : err.message;

  res.status(statusCode).json({ message });
};

module.exports = errorHandler;
