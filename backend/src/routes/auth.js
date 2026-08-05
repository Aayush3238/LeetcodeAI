const express = require("express");
const passport = require("passport");
const { signup, login, setPassword, googleCallback, githubCallback, getProfile, updateProfile, deleteAccount } = require("../controllers/authController");
const { authenticate, generateAccessToken, generateRefreshToken, refreshAccessToken, revokeRefreshToken } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/set-password", authenticate, setPassword);

router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }

    const result = await refreshAccessToken(refreshToken);
    const accessToken = generateAccessToken(result.userId);

    res.json({ accessToken, userId: result.userId });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
});

router.post("/logout", authenticate, async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }
    res.json({ message: "Logged out" });
  } catch (error) {
    res.json({ message: "Logged out" });
  }
});

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" }));
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login?error=auth_failed", session: false }),
  googleCallback
);

router.get("/github", passport.authenticate("github", { scope: ["user:email", "repo"] }));
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login?error=auth_failed", session: false }),
  githubCallback
);

router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);
router.delete("/account", authenticate, deleteAccount);

module.exports = router;
