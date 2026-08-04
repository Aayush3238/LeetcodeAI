const express = require("express");
const passport = require("passport");
const { signup, login, googleCallback, getProfile, updateProfile, deleteAccount } = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" }));
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login?error=auth_failed", session: false }),
  googleCallback
);

router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);
router.delete("/account", authenticate, deleteAccount);

module.exports = router;
