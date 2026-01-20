/**
 * @swagger
 * tags:
 *   name: Achievements
 *   description: Game achievements and catalog
 */

/**
 * @swagger
 * /api/achievements/catalog:
 *   get:
 *     summary: List all available achievements in the system
 *     description: Get the complete catalog of all achievements. Can be filtered by game.
 *     tags: [Achievements]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: gameSlug
 *         schema:
 *           type: string
 *         description: Filter achievements by game slug
 *         example: tic-tac-toe
 *     responses:
 *       200:
 *         description: List of all achievements
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: First Steps
 *                       description:
 *                         type: string
 *                         example: Play your first game
 *                       icon_url:
 *                         type: string
 *                         nullable: true
 *                       game_slug:
 *                         type: string
 *                         nullable: true
 *                         example: tic-tac-toe
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/achievements:
 *   get:
 *     summary: Get current authenticated user achievements
 *     description: Retrieve achievements earned by the current user. Can filter by game, search by name, and optionally include unearned achievements.
 *     tags: [Achievements]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: gameSlug
 *         schema:
 *           type: string
 *         description: Filter achievements by game slug
 *         example: tic-tac-toe
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search achievements by name (case-insensitive)
 *         example: first
 *       - in: query
 *         name: includeUnearned
 *         schema:
 *           type: string
 *           enum: ['true', 'false']
 *         description: Include unearned achievements in the response (default false)
 *         example: 'true'
 *     responses:
 *       200:
 *         description: List of user achievements
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Achievement'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
