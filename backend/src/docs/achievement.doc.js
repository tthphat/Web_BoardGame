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
 *     tags: [Achievements]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Catalog list
 */

/**
 * @swagger
 * /api/achievements:
 *   get:
 *     summary: Get current authenticated user achievements
 *     tags: [Achievements]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Earned achievements list
 */
