const express = require("express");
const { getProblems, getTopics } = require("../controllers/problemController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * /api/problems:
 *   get:
 *     tags: [Problems]
 *     summary: Get paginated list of problems
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by problem title
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [Easy, Medium, Hard]
 *       - in: query
 *         name: topic
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [solved, attempted, todo]
 *     responses:
 *       200:
 *         description: Paginated problems list
 */
router.get("/", authenticate, getProblems);

/**
 * @swagger
 * /api/problems/topics:
 *   get:
 *     tags: [Problems]
 *     summary: Get list of all topics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of topics
 */
router.get("/topics", authenticate, getTopics);

module.exports = router;
