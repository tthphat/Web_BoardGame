/**
 * @swagger
 * tags:
 *   name: Games
 *   description: Game management, ratings, and stats
 */

/**
 * @swagger
 * /api/games/enabled:
 *   get:
 *     summary: Get list of enabled games
 *     tags: [Games]
 *     security: []
 *     responses:
 *       200:
 *         description: Enabled games list
 */

/**
 * @swagger
 * /api/games/ratings:
 *   post:
 *     summary: Add game rating
 *     tags: [Games]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [slug, rating]
 *             properties:
 *               slug:
 *                 type: string
 *               rating:
 *                 type: integer
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Rating added
 */

/**
 * @swagger
 * /api/games/{slug}/ratings:
 *   get:
 *     summary: Get ratings for a game
 *     tags: [Games]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ratings list
 */

/**
 * @swagger
 * /api/games/all:
 *   get:
 *     summary: List all games (Admin)
 *     tags: [Games]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Games list
 */

/**
 * @swagger
 * /api/games/toggle:
 *   put:
 *     summary: Toggle game enabled status (Admin)
 *     tags: [Games]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id, enabled]
 *             properties:
 *               id:
 *                 type: integer
 *               enabled:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Status updated
 */

/**
 * @swagger
 * /api/games/my-stats:
 *   get:
 *     summary: Get current authenticated user stats
 *     tags: [Games]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User stats
 */

/**
 * @swagger
 * /api/games/my-stats/{slug}:
 *   get:
 *     summary: Get user stats for a specific game
 *     tags: [Games]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Game stats
 */

/**
 * @swagger
 * /api/games/finish:
 *   post:
 *     summary: Finish game and record stats
 *     tags: [Games]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [gameSlug, result]
 *             properties:
 *               gameSlug:
 *                 type: string
 *               result:
 *                 type: string
 *                 enum: [win, lose, draw]
 *     responses:
 *       200:
 *         description: Recorded
 */

/**
 * @swagger
 * /api/games/board-configs:
 *   get:
 *     summary: Get board configurations
 *     tags: [Games]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Board configs
 */

/**
 * @swagger
 * /api/games/save:
 *   post:
 *     summary: Save game session
 *     tags: [Games]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Session saved
 */

/**
 * @swagger
 * /api/games/load/{slug}:
 *   get:
 *     summary: Load game session
 *     tags: [Games]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session data
 */
