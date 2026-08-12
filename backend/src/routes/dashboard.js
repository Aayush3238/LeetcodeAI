const express = require("express");
const { getDashboard, getAnalytics, getWeakTopics, getDifficultyProgress } = require("../controllers/dashboardController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get dashboard overview data
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data with stats, topic distribution, and daily activity
 */
router.get("/", authenticate, getDashboard);

/**
 * @swagger
 * /api/dashboard/analytics:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get detailed analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data
 */
router.get("/analytics", authenticate, getAnalytics);

/**
 * @swagger
 * /api/dashboard/difficulty-progress:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get cumulative difficulty progress over time
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of days to look back
 *     responses:
 *       200:
 *         description: Difficulty progress data
 */
router.get("/difficulty-progress", authenticate, getDifficultyProgress);

/**
 * @swagger
 * /api/dashboard/weak-topics:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get weak topics for revision
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Weak topics list
 */
router.get("/weak-topics", authenticate, getWeakTopics);

module.exports = router;
