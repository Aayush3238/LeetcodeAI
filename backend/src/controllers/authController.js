const bcrypt = require("bcryptjs");
const prisma = require("../config/db");
const { generateToken } = require("../middleware/auth");
const { signupSchema, loginSchema, updateProfileSchema } = require("../validators/auth");

const userSelect = {
  id: true,
  name: true,
  email: true,
  avatar: true,
  leetcodeUsername: true,
  googleId: true,
  githubId: true,
  createdAt: true,
};

const signup = async (req, res, next) => {
  try {
    const data = signupSchema.parse(req.body);
    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: { ...data, password: hashedPassword },
      select: userSelect,
    });

    const token = generateToken(user.id);
    res.status(201).json({ user, token });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.password) {
      return res.status(401).json({ message: "This account uses social login. Please sign in with Google or GitHub." });
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user.id);
    const { password: _, ...userWithoutPassword } = user;

    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    next(error);
  }
};

const googleCallback = async (req, res) => {
  try {
    const token = generateToken(req.user.id);
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}/oauth/callback?token=${token}`);
  } catch (error) {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}/login?error=auth_failed`);
  }
};

const githubCallback = async (req, res) => {
  try {
    const token = generateToken(req.user.id);
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}/oauth/callback?token=${token}`);
  } catch (error) {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}/login?error=auth_failed`);
  }
};

const getProfile = async (req, res) => {
  res.json({ user: req.user });
};

const updateProfile = async (req, res, next) => {
  try {
    const data = updateProfileSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: userSelect,
    });

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    await prisma.user.delete({ where: { id: req.user.id } });
    res.json({ message: "Account deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login, googleCallback, githubCallback, getProfile, updateProfile, deleteAccount };
