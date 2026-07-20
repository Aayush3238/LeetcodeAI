const bcrypt = require("bcryptjs");
const prisma = require("../config/db");
const { generateToken } = require("../middleware/auth");
const { signupSchema, loginSchema, updateProfileSchema } = require("../validators/auth");

const signup = async (req, res, next) => {
  try {
    const data = signupSchema.parse(req.body);
    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: { ...data, password: hashedPassword },
      select: { id: true, name: true, email: true, avatar: true, createdAt: true },
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

const getProfile = async (req, res) => {
  res.json({ user: req.user });
};

const updateProfile = async (req, res, next) => {
  try {
    const data = updateProfileSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: { id: true, name: true, email: true, avatar: true, leetcodeUsername: true, createdAt: true },
    });

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login, getProfile, updateProfile };
