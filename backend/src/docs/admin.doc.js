/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Administrative controls and statistics (Requires Admin Role)
 */

/**
 * @swagger
 * /api/admin/dashboard-stats:
 *   get:
 *     summary: Get dashboard overview stats (Admin Only)
 *     tags: [Admin]
 *     description: Retrieve system-wide statistics. Requires administrative privileges.
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics data
 */

/**
 * @swagger
 * /api/admin/statistics:
 *   get:
 *     summary: Get detailed statistics (Admin Only)
 *     tags: [Admin]
 *     description: Retrieve detailed game and user analytics. Requires administrative privileges.
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics
 */

/**
 * @swagger
 * /api/admin/recent-activities:
 *   get:
 *     summary: Get recent system activities (Admin Only)
 *     tags: [Admin]
 *     description: List recent logins, game starts, and other vital events. Requires administrative privileges.
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Activity list
 */

/**
 * @swagger
 * /api/admin/games:
 *   get:
 *     summary: List games for management (Admin Only)
 *     tags: [Admin]
 *     description: List all games including disabled ones for configuration. Requires administrative privileges.
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Games list
 */

/**
 * @swagger
 * /api/admin/games/{id}/state:
 *   patch:
 *     summary: Update game state (Admin Only)
 *     tags: [Admin]
 *     description: Change the state (active/inactive) or other metadata of a specific game. Requires administrative privileges.
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               state:
 *                 type: string
 *     responses:
 *       200:
 *         description: State updated
 */

/**
 * @swagger
 * /api/admin/board-configs:
 *   get:
 *     summary: List board configurations for management
 *     tags: [Admin]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Board configs list
 */

/**
 * @swagger
 * /api/admin/board-configs/{id}:
 *   put:
 *     summary: Update board config
 *     tags: [Admin]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Config updated
 */

/**
 * @swagger
 * /api/admin/board-configs/{id}/activate:
 *   put:
 *     summary: Activate board config
 *     tags: [Admin]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Activated
 */
