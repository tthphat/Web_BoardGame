/**
 * @swagger
 * tags:
 *   name: User
 *   description: User profile and social interactions
 */

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get current authenticated user profile
 *     tags: [User]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile details
 */

/**
 * @swagger
 * /api/user/profile:
 *   patch:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               fullname:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 */

/**
 * @swagger
 * /api/user/me:
 *   get:
 *     summary: Get basic info of current user
 *     tags: [User]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User info
 */

/**
 * @swagger
 * /api/user/all:
 *   get:
 *     summary: List all users (System)
 *     tags: [User]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users list
 */

/**
 * @swagger
 * /api/user/{id}/state:
 *   patch:
 *     summary: Update user state (Block/Unblock)
 *     tags: [User]
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
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [state]
 *             properties:
 *               state:
 *                 type: string
 *                 enum: [active, blocked]
 *     responses:
 *       200:
 *         description: User state updated
 */

/**
 * @swagger
 * /api/user/all-users:
 *   get:
 *     summary: List all users for social features
 *     tags: [User]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users list
 */

/**
 * @swagger
 * /api/user/friend-requests:
 *   get:
 *     summary: List pending friend requests
 *     tags: [User]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Friend requests list
 */

/**
 * @swagger
 * /api/user/my-friends:
 *   get:
 *     summary: List all friends of current user
 *     tags: [User]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Friends list
 */

/**
 * @swagger
 * /api/user/add-friend:
 *   post:
 *     summary: Send a friend request
 *     tags: [User]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [friendId]
 *             properties:
 *               friendId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Request sent
 */

/**
 * @swagger
 * /api/user/accept-friend:
 *   post:
 *     summary: Accept a friend request
 *     tags: [User]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [friendId]
 *             properties:
 *               friendId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Request accepted
 */

/**
 * @swagger
 * /api/user/reject-friend:
 *   post:
 *     summary: Reject a friend request
 *     tags: [User]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [friendId]
 *             properties:
 *               friendId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Request rejected
 */

/**
 * @swagger
 * /api/user/remove-friend:
 *   post:
 *     summary: Remove a friend
 *     tags: [User]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [friendId]
 *             properties:
 *               friendId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Friend removed
 */

/**
 * @swagger
 * /api/user/all-my-conversations:
 *   get:
 *     summary: List all user conversations
 *     tags: [User]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Conversations list
 */

/**
 * @swagger
 * /api/user/conversations/{id}/messages:
 *   get:
 *     summary: Get messages in a conversation
 *     tags: [User]
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
 *         description: Messages list
 */

/**
 * @swagger
 * /api/user/conversations/{id}/messages:
 *   post:
 *     summary: Send a message in a conversation
 *     tags: [User]
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
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent
 */

/**
 * @swagger
 * /api/user/search:
 *   get:
 *     summary: Search for users
 *     tags: [User]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *     responses:
 *       200:
         description: Matching users
 */

/**
 * @swagger
 * /api/user/get-user/{id}:
 *   get:
 *     summary: Get details of a specific user
 *     tags: [User]
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
 *         description: User details
 */

/**
 * @swagger
 * /api/user/conversations/{id}/new:
 *   post:
 *     summary: Create new conversation
 *     tags: [User]
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
 *       201:
 *         description: Conversation created
 */

/**
 * @swagger
 * /api/user/conversations/{id}/exist:
 *   get:
 *     summary: Check if conversation exists
 *     tags: [User]
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
 *         description: Existence status
 */

/**
 * @swagger
 * /api/user/conversations/{id}:
 *   delete:
 *     summary: Delete a conversation
 *     tags: [User]
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
 *         description: Conversation deleted
 */
