const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error.name === "ZodError") {
      const message = error.errors.map((e) => e.message).join(", ");
      return res.status(400).json({ message });
    }
    next(error);
  }
};

module.exports = validate;
