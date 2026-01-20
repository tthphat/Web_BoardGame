/**
 * @swagger
 * tags:
 *   name: Games
 *   description: Game management, ratings, leaderboards, and stats
 */

/**
 * @swagger
 * /api/games/enabled:
 *   get:
 *     summary: Get list of enabled games
 *     description: Public endpoint to get all games that are currently enabled/active.
 *     tags: [Games]
 *     security: []
 *     responses:
 *       200:
 *         description: List of enabled games
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Game'
 */

/**
 * @swagger
 * /api/games/leaderboard:
 *   get:
 *     summary: Get leaderboards for all enabled games
 *     description: Get top players leaderboard for all enabled games. Can filter by friends or specific user.
 *     tags: [Games]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of top players to return per game
 *         example: 10
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum: [friends]
 *         description: Filter leaderboard to show only friends
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Filter to show only a specific user's ranking
 *     responses:
 *       200:
 *         description: Leaderboards for all games
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       game_id:
 *                         type: integer
 *                         example: 1
 *                       game_name:
 *                         type: string
 *                         example: Tic Tac Toe
 *                       game_slug:
 *                         type: string
 *                         example: tic-tac-toe
 *                       leaderboard:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             rank:
 *                               type: integer
 *                               example: 1
 *                             user_id:
 *                               type: integer
 *                               example: 1
 *                             username:
 *                               type: string
 *                               example: johndoe
 *                             total_wins:
 *                               type: integer
 *                               example: 50
 *                             total_plays:
 *                               type: integer
 *                               example: 100
 *                             best_score:
 *                               type: integer
 *                               example: 1000
 *       401:
 *         description: Authentication required for friends filter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/games/{slug}/leaderboard:
 *   get:
 *     summary: Get leaderboard for a specific game
 *     description: Get the leaderboard ranking for a specific game by its slug. Supports pagination and filtering.
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
 *         description: Game slug identifier
 *         example: tic-tac-toe
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of results per page
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum: [friends]
 *         description: Filter leaderboard to show only friends
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Filter to show only a specific user's ranking
 *     responses:
 *       200:
 *         description: Game leaderboard with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rank:
 *                         type: integer
 *                         example: 1
 *                       user_id:
 *                         type: integer
 *                         example: 1
 *                       username:
 *                         type: string
 *                         example: johndoe
 *                       avatar_url:
 *                         type: string
 *                         nullable: true
 *                       total_wins:
 *                         type: integer
 *                         example: 50
 *                       total_plays:
 *                         type: integer
 *                         example: 100
 *                       best_score:
 *                         type: integer
 *                         example: 1000
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       404:
 *         description: Game not found or disabled
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/games/ratings:
 *   post:
 *     summary: Add or update game rating
 *     description: Submit a rating and optional comment for a game. If user already rated, it will update the existing rating.
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
 *             required: [gameSlug, rating]
 *             properties:
 *               gameSlug:
 *                 type: string
 *                 description: Game slug identifier
 *                 example: tic-tac-toe
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating from 1 to 5 stars
 *                 example: 5
 *               comment:
 *                 type: string
 *                 description: Optional review comment
 *                 example: Great game, very fun!
 *     responses:
 *       201:
 *         description: Rating added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     user_id:
 *                       type: integer
 *                       example: 1
 *                     game_id:
 *                       type: integer
 *                       example: 1
 *                     rating:
 *                       type: integer
 *                       example: 5
 *                     comment:
 *                       type: string
 *                       example: Great game!
 *       400:
 *         description: Missing game slug or invalid rating
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Game not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/games/{slug}/ratings:
 *   get:
 *     summary: Get ratings for a game
 *     description: Get all ratings and reviews for a specific game with pagination.
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
 *         description: Game slug identifier
 *         example: tic-tac-toe
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of ratings per page
 *     responses:
 *       200:
 *         description: Game ratings with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 ratings:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       user_id:
 *                         type: integer
 *                         example: 1
 *                       username:
 *                         type: string
 *                         example: johndoe
 *                       rating:
 *                         type: integer
 *                         example: 5
 *                       comment:
 *                         type: string
 *                         example: Great game!
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                 averageRating:
 *                   type: number
 *                   format: float
 *                   example: 4.5
 *                 totalRatings:
 *                   type: integer
 *                   example: 50
 *                 userRating:
 *                   type: object
 *                   nullable: true
 *                   description: Current user's rating if authenticated
 *                   properties:
 *                     rating:
 *                       type: integer
 *                       example: 5
 *                     comment:
 *                       type: string
 *                       example: Love it!
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       404:
 *         description: Game not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/games/all:
 *   get:
 *     summary: List all games (Admin Only)
 *     description: Retrieve all games in the system including disabled ones. Requires admin role.
 *     tags: [Games]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All games list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Game'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/games/toggle:
 *   put:
 *     summary: Toggle game enabled status (Admin Only)
 *     description: Enable or disable a game globally. Requires admin role.
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
 *             required: [gameId, enabled]
 *             properties:
 *               gameId:
 *                 type: integer
 *                 description: Game ID to toggle
 *                 example: 1
 *               enabled:
 *                 type: boolean
 *                 description: New enabled status
 *                 example: true
 *     responses:
 *       200:
 *         description: Game status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Game'
 *                 message:
 *                   type: string
 *                   example: Game enabled successfully
 *       400:
 *         description: Missing gameId or enabled field
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/games/my-stats:
 *   get:
 *     summary: Get current authenticated user stats for all games
 *     description: Retrieve game statistics for the current user across all games they have played.
 *     tags: [Games]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User game statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       game_id:
 *                         type: integer
 *                         example: 1
 *                       game_name:
 *                         type: string
 *                         example: Tic Tac Toe
 *                       game_slug:
 *                         type: string
 *                         example: tic-tac-toe
 *                       total_wins:
 *                         type: integer
 *                         example: 10
 *                       total_plays:
 *                         type: integer
 *                         example: 25
 *                       best_score:
 *                         type: integer
 *                         example: 500
 *                       total_score:
 *                         type: integer
 *                         example: 2500
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/games/my-stats/{slug}:
 *   get:
 *     summary: Get user stats for a specific game
 *     description: Get detailed statistics for the current user for a specific game.
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
 *         description: Game slug identifier
 *         example: tic-tac-toe
 *     responses:
 *       200:
 *         description: User's game statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/GameStats'
 *       404:
 *         description: Game not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/games/finish:
 *   post:
 *     summary: Record game completion and update stats
 *     description: Called when a game ends to record the result and update user statistics.
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
 *                 description: Game slug identifier
 *                 example: tic-tac-toe
 *               result:
 *                 type: string
 *                 enum: [win, lose, draw]
 *                 description: Game result
 *                 example: win
 *               score:
 *                 type: integer
 *                 description: Optional score achieved
 *                 example: 100
 *     responses:
 *       200:
 *         description: Game result recorded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     stats:
 *                       $ref: '#/components/schemas/GameStats'
 *                     achievements:
 *                       type: array
 *                       description: Any new achievements unlocked
 *                       items:
 *                         $ref: '#/components/schemas/Achievement'
 *       400:
 *         description: Missing game slug
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/games/board-configs:
 *   get:
 *     summary: Get active board configurations
 *     description: Get the currently active board configuration for games that support customizable boards.
 *     tags: [Games]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Board configurations
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
 *                       game_id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: Default 8x8
 *                       config:
 *                         type: object
 *                         description: Board configuration (rows, cols, etc.)
 *                         example: { "rows": 8, "cols": 8 }
 *                       is_active:
 *                         type: boolean
 *                         example: true
 */

/**
 * @swagger
 * /api/games/save:
 *   post:
 *     summary: Save game session
 *     description: Save the current game state for later resumption.
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
 *             required: [slug, state]
 *             properties:
 *               slug:
 *                 type: string
 *                 description: Game slug identifier
 *                 example: tic-tac-toe
 *               state:
 *                 type: object
 *                 description: Game state to save (JSON object)
 *                 example: { "board": [[null, "X", null], [null, "O", null], [null, null, null]], "currentPlayer": "X" }
 *     responses:
 *       200:
 *         description: Game saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game saved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     saved_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Missing slug or state
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/games/load/{slug}:
 *   get:
 *     summary: Load saved game session
 *     description: Load a previously saved game state.
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
 *         description: Game slug identifier
 *         example: tic-tac-toe
 *     responses:
 *       200:
 *         description: Saved game data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     user_id:
 *                       type: integer
 *                       example: 1
 *                     game_slug:
 *                       type: string
 *                       example: tic-tac-toe
 *                     state:
 *                       type: object
 *                       description: Saved game state
 *                     saved_at:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: No saved game found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No saved game found
 */
